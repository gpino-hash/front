"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { AuthRole } from "@/lib/auth/types";

interface RoleGateProps {
    allowedRoles: AuthRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectTo?: string;
}

export function RoleGate({ allowedRoles, children, fallback, redirectTo }: RoleGateProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const hasAccess = user?.roles?.some((role) => allowedRoles.includes(role)) ?? false;

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!hasAccess && redirectTo) {
            router.push(redirectTo);
        }
    }, [isLoading, isAuthenticated, hasAccess, redirectTo, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-pulse flex flex-col items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                    <div className="h-3 bg-slate-200 rounded w-24" />
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        if (fallback) return <>{fallback}</>;

        return (
            <div className="flex items-center justify-center min-h-[300px] px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-red-500">block</span>
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-800 mb-2">Acceso restringido</h2>
                    <p className="text-zinc-500 text-sm">No tenés permisos para acceder a esta sección.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}