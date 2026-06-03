import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { error: "Email, code, and password are required" },
        { status: 400 }
      );
    }

    const clientId = process.env.COGNITO_CLIENT_ID || "";
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
    const region = process.env.AWS_REGION || "us-east-1";

    const client = new CognitoIdentityProviderClient({ region });
    const secretHash = calculateSecretHash(email, clientId, clientSecret);

    const command = new ConfirmForgotPasswordCommand({
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      ConfirmationCode: code,
      Password: password,
    });

    await client.send(command);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 400 });
  }
}
