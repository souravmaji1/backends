import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useCookies } from "react-cookie";

const protectedRoutes = ["/dashboard"];

const isAuth = true

export default function middleware(req: NextRequest) {
    if (!isAuth && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/", req.nextUrl.origin)
        return NextResponse.redirect(absoluteURL.toString())
    }
}