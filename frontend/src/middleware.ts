import NextAuth from "next-auth"
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const {auth} = NextAuth(authConfig);

export default auth((req)=>{
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user.role;
    const {nextUrl} = req;

    // add list of protected routes to given array
    const isProtectedRoute = ["/Bidder"].includes(nextUrl.pathname);

    // all admin routes to start with /admin
    const isAdminRoute = (nextUrl.pathname).startsWith("/admin");

    // USER ROUTES
    if(isProtectedRoute && !isLoggedIn) return NextResponse.redirect(`${nextUrl.origin}/`);

    // ADMIN ROUTES
    if(isAdminRoute && role!=="admin") return NextResponse.redirect(`${nextUrl.origin}/Bidder`);

})

export const config = {
    matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)']
}