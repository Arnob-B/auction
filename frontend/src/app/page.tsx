import LoginForm from "@/components/LoginForm";
import React from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function Login() {
  // Redirect to /Bidder if logged in as user
  // Redirect to /admin if logged in as admin
  const session = await auth();
  if(session && session.user.role=='ADMIN') redirect("/admin");
  if(session && session.user.role=='USER') redirect("/Bidder");
  // console.log(session);
	return <main className="flex flex-col justify-center items-center h-full">
    <div className="bg-gradient-to-tr from-[#00000040] via-[#00000020] to-secondary backdrop-blur-lg border border-[#ffffff40] rounded-xl shadow-lg p-6 mx-2 max-w-sm flex flex-col items-center gap-y-4">
      <Image src="/esummit-logo.png" alt="E-Summit'24" width={300} height={100} className="w-3/4"/>
      <h1 className="text-xl font-opensans font-medium text-accent">Presents</h1>
      <Image src="/mock-ipl-logo.png" alt="E-Summit'24" width={300} height={100} className="w-3/5 aspect-video"/>
      <LoginForm />
    </div>
  </main>;
}

export default Login;