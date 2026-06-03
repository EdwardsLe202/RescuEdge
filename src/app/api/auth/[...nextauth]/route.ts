import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

// Secret hash calculation required when App Client has a Client Secret
function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Cognito Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const clientId = process.env.COGNITO_CLIENT_ID || "";
        const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
        const region = process.env.AWS_REGION || "us-east-1";

        try {
          const client = new CognitoIdentityProviderClient({ region });
          const secretHash = calculateSecretHash(credentials.email, clientId, clientSecret);

          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: clientId,
            AuthParameters: {
              USERNAME: credentials.email,
              PASSWORD: credentials.password,
              SECRET_HASH: secretHash,
            },
          });

          const response = await client.send(command);

          if (response.AuthenticationResult) {
            return {
              id: credentials.email,
              email: credentials.email,
              name: credentials.email.split("@")[0],
              accessToken: response.AuthenticationResult.AccessToken,
              idToken: response.AuthenticationResult.IdToken,
            };
          }
          return null;
        } catch (error: any) {
          console.error("Cognito auth error:", error);
          throw new Error(error.message || "Failed to authenticate with AWS Cognito");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Pass the tokens to the token object during initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.idToken = (user as any).idToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose custom Cognito session tokens to client side
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
