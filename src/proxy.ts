import { NextRequest, NextResponse } from "next/server";

import { Roles } from "./constants/roles";
import { userService } from "./services/user.service";

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
    const { data } = await userService.getSession();

    // Not authenticated → redirect to login
    if (!data) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const config = roleConfig[data.user.role];

    // Unknown role → redirect to login
    if (!config) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // User trying to access forbidden path → redirect to their home
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
        // "/dashboard",
        "/dashboard/:path*",
        // "/admin-dashboard",
        "/admin-dashboard/:path*",
        // "/tutor-dashboard",
        "/tutor-dashboard/:path*",
    ],
};
