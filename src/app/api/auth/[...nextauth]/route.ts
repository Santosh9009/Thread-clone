import nextAuth from "next-auth";
import { authOptions } from "./options";
import { pages } from "next/dist/build/templates/app-page";

const handler = nextAuth(authOptions);


export {handler as GET , handler as POST}