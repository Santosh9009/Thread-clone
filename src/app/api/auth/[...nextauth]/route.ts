import nextAuth from "next-auth";
import { authOptions } from "./options";
import { pages } from "next/dist/build/templates/app-page";

const handler = nextAuth(authOptions);
pages:{
  signIn: '/auth/signin'
}


export {handler as GET , handler as POST}