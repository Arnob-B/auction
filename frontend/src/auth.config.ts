import type {NextAuthConfig, DefaultSession} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./utils/loginSchema"
import {prisma} from "@/utils/db"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"


declare module "next-auth" {
    interface User{
        // userId?: string,
        role?: string
    }
    interface JWT{
        // userId: string,
        role: string
    }
    interface Session {
      user: {
        // userId: string,
        role: string
      } & DefaultSession["user"]
    }
  }

export default{
    providers: [
        Credentials({
            async authorize(credentials){
                const validatedFields = loginSchema.safeParse(credentials);
                if(validatedFields.success){
                    const {id, password} = validatedFields.data;

                    const user = await prisma.user.findFirst({where:{id}});

                    if (!user || !user.password) return null;

                    const passwordMatch = await bcrypt.compare(password,user.password);
                    
                    if(passwordMatch) return user;
                }
                return null;
            }
        })
    ],
    callbacks: {
        async session({token,session}){
            if(token?.id)
                session.user.id = token.id as string;
            if(token?.role)
                session.user.role = token.role as string;
            return session;
        },
        async jwt({token,user}){
            if(user?.id)
                token.id = user.id;
            if(user?.role)
                token.role = user.role;
            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"}
} satisfies NextAuthConfig