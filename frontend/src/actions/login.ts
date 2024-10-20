'use server';
import {z} from "zod";
import { loginSchema } from "@/utils/loginSchema";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
// import { seedUsers } from "@/utils/seedUsers";

export const handleLogin = async (data:z.infer<typeof loginSchema>) => {
    // THIS NEEDS TO BE RUNS ONLY ONCE TO ADD USERS TO THE DATABASE, THERE'S PROBABLY A BETTER WAY TO DO THIS BUT ABHI KE LIYE JUST DOING THIS
    // await seedUsers();

    const validatedFields = loginSchema.safeParse(data);
    if(!validatedFields.success){
        return {errors:validatedFields.error.errors};
    }

    const { id, password, adminCode} = validatedFields.data;

    try {
        await signIn("credentials",{
            id,
            password,
            adminCode,
            redirectTo: "/Bidder"
        })
    } catch (error) {
        if(error instanceof AuthError){
            if(error.type==="CredentialsSignin"){
                return {error:"Invalid Credentials"}
            }
            else
                return {error:"Something went wrong"}
        }
        throw error;
    }

    return {success:true,message:"Logged In"};
}