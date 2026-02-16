import { NextRequest, NextResponse } from "next/server";

import { Roles } from "@/constants/roles";

const roleConfig: Record<
    string,
    { homePath: string; forbiddenPaths: string[] }
> = {
    [Roles.admin]: {
        homePath: "/admin-dashboard",
        forbiddenPaths: ["/dashboard", "/tutor-dashboard"],
    },
    [Roles.student]: {
        homePath: "/dashboard",
        forbiddenPaths: ["/admin-dashboard", "/tutor-dashboard"],
    },
    [Roles.tutor]: {
        homePath: "/tutor-dashboard",
        forbiddenPaths: ["/admin-dashboard", "/dashboard"],
    },
};

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const authBaseUrl = process.env.AUTH_URL ?? process.env.BACKEND_URL;
    const requestCookie = request.headers.get("cookie") ?? "";

    if (!authBaseUrl) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    let data: { user?: { role?: string } } | null = null;
    try {
        const response = await fetch(`${authBaseUrl}/api/auth/get-session`, {
            headers: { Cookie: requestCookie },
            cache: "no-store",
        });

        if (response.ok) {
            data = await response.json();
        }
    } catch {
        data = null;
    }

    if (!data?.user?.role) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const config = roleConfig[data.user.role];

    if (!config) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const isForbidden = config.forbiddenPaths.some((path) =>
        pathname.startsWith(path),
    );

    if (isForbidden) {
        return NextResponse.redirect(new URL(config.homePath, request.url));
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
