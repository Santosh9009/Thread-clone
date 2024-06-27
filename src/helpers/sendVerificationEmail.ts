import { Resend } from "resend";
import Email from "../../Emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "WhisperWeb otp",
      react: Email({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification Email send Successfully" };
  } catch (emailError) {
    console.log("Error sending verification Email", emailError);
    return { success: false, message: "Failed to send verification Email" };
  }
}
