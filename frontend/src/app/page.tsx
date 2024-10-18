import LoginForm from "@/components/LoginForm";
import React from "react";

async function Login() {
  // Redirect to /Bidder if logged in as user
  // Redirect to /admin if logged in as admin
	return <main className="flex flex-col justify-center items-center h-full">
    <div className="flex flex-col items-center gap-y-2 bg-white text-black p-8 rounded-xl">
      <h1 className="text-4xl font-bold">Mock IPL Auction</h1>
      <h2 className="text-2xl font-semibold my-2">Login</h2>
      <LoginForm />
    </div>
  </main>;
}

export default Login;
