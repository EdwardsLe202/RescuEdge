import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const clientId = process.env.COGNITO_CLIENT_ID || "";
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
    const region = process.env.AWS_REGION || "us-east-1";

    const client = new CognitoIdentityProviderClient({ region });
    const secretHash = calculateSecretHash(email, clientId, clientSecret);

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      ConfirmationCode: code,
    });

    await client.send(command);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Confirm sign up error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm account" }, { status: 400 });
  }
}
