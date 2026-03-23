import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/perfil", "/nueva-solicitud"];
const authPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
const providerPaths = ["/dashboard/proveedor"];
const clientPaths = ["/dashboard/cliente"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const authToken = request.cookies.get("taskao_auth_token")?.value;
    const isAuthenticated = !!authToken;

    // Read roles from cookie set by the client on login
    const rolesCookie = request.cookies.get("taskao_user_roles")?.value;
    const userRoles: string[] = rolesCookie ? JSON.parse(rolesCookie) : [];

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && authPaths.some((p) => pathname.startsWith(p))) {
        const isProvider = userRoles.includes("PROVIDER");
        const dashboardUrl = isProvider ? "/dashboard/proveedor" : "/dashboard/cliente";
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // Redirect unauthenticated users to login from protected pages
    if (!isAuthenticated && protectedPaths.some((p) => pathname.startsWith(p))) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based access control
    if (isAuthenticated && userRoles.length > 0) {
        // Provider trying to access client dashboard
        if (clientPaths.some((p) => pathname.startsWith(p)) && !userRoles.includes("CLIENT")) {
            return NextResponse.redirect(new URL("/dashboard/proveedor", request.url));
        }

        // Client trying to access provider dashboard
        if (providerPaths.some((p) => pathname.startsWith(p)) && !userRoles.includes("PROVIDER")) {
            return NextResponse.redirect(new URL("/dashboard/cliente", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/perfil/:path*",
        "/nueva-solicitud/:path*",
        "/login",
        "/register",
        "/register/:path*",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
    ],
};