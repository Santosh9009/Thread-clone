import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(Credentials:any) {
        const user = { id:"1",name: "sonu", age: "5",email:"padisonu@gmail.com"};

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret:process.env.NEXTAUTH_SECRET,
  callbacks:{
    async session({ session,token, user}:any) {
      if(session && session.user){
        session.user.id = token.sub;
        console.log("Session:",session)
        console.log("Token:",token)
      }
      return session;
    }
  }
};
