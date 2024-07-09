import 'next-auth';

declare module 'next-auth' {

  interface Session {
    user:{
    _id?:string;
    isVerified?:boolean;
    username?:string;
    isOnboarded?:boolean
    } & DefaultSession["user"];
  }

  interface User {
    _id?:string;
    isVerified?:boolean;
    username?:string;
    isOnboarded?:boolean
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    _id?:string;
    isVerified?:boolean;
    username?:string;
    isOnboarded?:boolean
  }
}
