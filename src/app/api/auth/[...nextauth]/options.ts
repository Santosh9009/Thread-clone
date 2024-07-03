import bcrypt from 'bcryptjs'; 
import UserModel from "@/Model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from '@/lib/dbConnect';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "johndoe@gmail.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials):Promise<any> {
        try{
          await dbConnect();
          
          const user = await UserModel.findOne({$or:[
            {
              email:credentials?.email
            },{
              username:credentials?.email
            }
          ]

          })
          if(!user){
            throw new Error("No User found")
          }
          if(!user.isVerified){
            throw new Error("Please verify the email")
          }

          const isCorrectPassword = await bcrypt.compare(credentials?.password || '',user.password);
          if(isCorrectPassword){
            return user;
          }else{
            throw new Error("Incorrect Password")
          }
          
        }catch(err:any){
          throw new Error("An Unexpected error occured");
        }
        
      },
    }),
  ],
  secret:process.env.NEXTAUTH_SECRET,

  callbacks:{
    async jwt({ token, user }) {
      if(user){
        token._id = user._id?.toString();
        token.username = user.username,
        token.name = user.name;
        token.email = user.email,
        token.isverfied = user.isVerified,
        token.isAcceptingMessages = user.isAcceptingMessages
      }
      return token;
    },
    async session({ session,token,user}) {
      if(token && session.user){
        session.user._id = user._id?.toString();
        session.user.username = user.username,
        session.user.name = user.name;
        session.user.email = user.email,
        session.user.isverfied = user.isVerified,
        session.user.isAcceptingMessages = user.isAcceptingMessages
      }
      return session;
    }
  },
  pages:{
    signIn: '/login'
  }
};
