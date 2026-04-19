"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authService } from "@/lib/auth/auth-service";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/layout/logo";

export default function GoogleCallbackPage() {
    return (
        <Suspense>
            <GoogleCallbackHandler />
        </Suspense>
    );
}

function GoogleCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshProfile } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handleCallback() {
            // El backend redirige con tokens como query params:
            // /auth/google/callback?accessToken=...&refreshToken=...&isNewUser=true|false
            const accessToken = searchParams.get("accessToken");
            const refreshToken = searchParams.get("refreshToken");
            const isNewUser = searchParams.get("isNewUser") === "true";
            const errorParam = searchParams.get("error");

            if (errorParam) {
                setError(
                    errorParam === "access_denied"
                        ? "Cancelaste el inicio de sesión con Google."
                        : "Error al conectar con Google. Intentá de nuevo."
                );
                return;
            }

            if (!accessToken || !refreshToken) {
                setError("No se recibieron los datos de autenticación de Google.");
                return;
            }

            // Almacenar tokens
            authService.storeOAuthTokens(accessToken, refreshToken);

            // Cargar perfil del usuario con los tokens recién almacenados
            const profile = await authService.getProfile();

            if (!profile) {
                setError("Error al obtener el perfil. Intentá iniciar sesión nuevamente.");
                return;
            }

            // Setear cookies de sesión (necesarias para protección de rutas)
            authService.setSessionCookies(profile.id, profile.roles);

            // Refrescar el contexto de auth
            await refreshProfile();

            // Redirigir según rol
            if (isNewUser) {
                router.push("/dashboard/cliente");
            } else {
                const isProvider = profile.roles?.includes("PROVIDER");
                router.push(isProvider ? "/dashboard/proveedor" : "/dashboard/cliente");
            }
        }

        handleCallback();
    }, [searchParams, router, refreshProfile]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-sm w-full text-center">
                    <Logo size="lg" />
                    <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-lg">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            Error de autenticación
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-colors"
                        >
                            Volver al login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="text-center">
                <Logo size="lg" />
                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Conectando con Google...
                    </p>
                </div>
            </div>
        </div>
    );
}