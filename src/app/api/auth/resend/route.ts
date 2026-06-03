import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const clientId = process.env.COGNITO_CLIENT_ID || "";
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
    const region = process.env.AWS_REGION || "us-east-1";

    const client = new CognitoIdentityProviderClient({ region });
    const secretHash = calculateSecretHash(email, clientId, clientSecret);

    const command = new ResendConfirmationCodeCommand({
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
    });

    await client.send(command);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Resend confirmation code error:", error);
    return NextResponse.json({ error: error.message || "Failed to resend confirmation code" }, { status: 400 });
  }
}
