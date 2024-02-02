import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
//middleware


export default withAuth(
    function middleware(req) {

        if(req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.roleName!=="Admin")
        return NextResponse.rewrite(new URL("/auth/login?message=you are not Authorized!",req.url))

        if(req.nextUrl.pathname.startsWith("/user") && req.nextauth.token?.roleName!=="user")
        return NextResponse.rewrite(new URL("/auth/login?message= you are not Authorized!",req.url))
    },
    {
        callbacks:{
            authorized:({token})=> !!token,
        }
    }
)

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"]
}