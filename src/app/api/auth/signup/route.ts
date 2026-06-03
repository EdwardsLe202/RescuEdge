import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

// Secret hash calculation required when App Client has a Client Secret
function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const clientId = process.env.COGNITO_CLIENT_ID || "";
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
    const region = process.env.AWS_REGION || "us-east-1";

    const client = new CognitoIdentityProviderClient({ region });
    const secretHash = calculateSecretHash(email, clientId, clientSecret);

    const command = new SignUpCommand({
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name || "" },
      ],
    });

    const response = await client.send(command);
    return NextResponse.json({ success: true, userSub: response.UserSub }, { status: 201 });
  } catch (error: any) {
    console.error("Sign up error:", error);
    return NextResponse.json({ error: error.message || "Failed to sign up" }, { status: 400 });
  }
}
