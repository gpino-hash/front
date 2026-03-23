"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth/auth-service";

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">(
        token ? "loading" : "no-token"
    );
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!token) {
            return;
        }

        async function verify() {
            const result = await authService.verifyEmail(token!);
            if (result.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMessage(result.error || "No se pudo verificar el email");
            }
        }

        verify();
    }, [token]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verificando tu email...</h1>
                    <p className="text-slate-500 dark:text-slate-400">Esto tomará un momento.</p>
                </div>
            </div>
        );
    }

    if (status === "no-token") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center mx-auto mb-8">
                        <span className="material-symbols-outlined text-3xl text-red-500">link_off</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Link inválido</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                        El link de verificación no es válido. Podés solicitar uno nuevo desde tu perfil.
                    </p>
                    <Link href="/perfil">
                        <Button className="w-full h-14 rounded-xl text-lg">Ir a mi perfil</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center mx-auto mb-8">
                        <span className="material-symbols-outlined text-3xl text-red-500">error</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Error de verificación</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">{errorMessage}</p>
                    <div className="space-y-4">
                        <Link href="/perfil">
                            <Button className="w-full h-14 rounded-xl text-lg">
                                Reenviar verificación
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full h-14 rounded-xl text-lg">
                                Ir al inicio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white mb-8 mx-auto shadow-md">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">¡Email verificado!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                    Tu email fue verificado correctamente. Ya podés usar todas las funciones de Taskao.
                </p>
                <Link href="/dashboard/cliente">
                    <Button className="w-full h-14 rounded-xl text-lg shadow-md">
                        Ir a mi dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}