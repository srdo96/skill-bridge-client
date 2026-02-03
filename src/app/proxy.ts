import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";
import { userService } from "./services/user.service";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    let isAuthenticated = false;
    let isAdmin = false;
    let isStudent = false;
    let isTutor = false;

    const { data } = await userService.getSession();

    if (data) {
        isAuthenticated = true;
        isAdmin = data.user.role === Roles.admin;
        isStudent = data.user.role === Roles.student;
        isTutor = data.user.role === Roles.tutor;
    }

    //* User in not authenticated at all
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    //* User is authenticated and role = ADMIN
    if (
        isAdmin &&
        pathname.startsWith("/dashboard") &&
        pathname.startsWith("/tutor-dashboard")
    ) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }

    //* User is authenticated and role = STUDENT
    if (
        isStudent &&
        pathname.startsWith("/admin-dashboard") &&
        pathname.startsWith("/tutor-dashboard")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    //* User is authenticated and role = TUTOR
    if (
        isStudent &&
        pathname.startsWith("/admin-dashboard") &&
        pathname.startsWith("/dashboard")
    ) {
        return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/admin-dashboard",
        "/admin-dashboard/:path*",
        "/tutor-dashboard",
        "/tutor-dashboard/:path*",
    ],
};
