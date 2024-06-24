import { Resend } from 'resend';
import  Email  from '../../Emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse>{
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: Email({ username: 'John' ,otp:'454545'}),
    });
    
    return {success:false,message:"Verification Email send Successfully"}
  } catch (Emailerror) {
    console.log("Error sending verification Email",Emailerror);
    return {success:false,message:"Failed to send verification Email"}
  }
}
