import type {NextAuthConfig, DefaultSession} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./utils/loginSchema"
import {prisma} from "@/utils/db"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"


declare module "next-auth" {
    interface User{
        userId?: string,
        role?: string
    }
    interface JWT{
        userId: string,
        role: string
    }
    interface Session {
      user: {
        userId: string,
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
                    const {userId, password} = validatedFields.data;

                    const user = await prisma.user.findFirst({where:{userId}});

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
            if(token?.userId)
                session.user.userId = token.userId as string;
            if(token?.role)
                session.user.role = token.role as string;
            return session;
        },
        async jwt({token,user}){
            if(user?.userId)
                token.userId = user.userId;
            if(user?.role)
                token.role = user.role;
            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"}
} satisfies NextAuthConfig