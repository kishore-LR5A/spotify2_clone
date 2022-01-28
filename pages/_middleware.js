import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  //Token will exist if the user is logged in.
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  //Allow the request if the following is true
  // 1)if the token exists
  // 2)if it is a request for nextAuth session or fetching the providers
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }
  // if they dont have a token, redirect them to the login page
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
