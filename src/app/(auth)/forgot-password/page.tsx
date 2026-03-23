"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { authService } from "@/lib/auth/auth-service";
import { Logo } from "@/components/layout/logo";

const forgotSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotFormValues) => {
        setIsLoading(true);
        setError(null);

        const result = await authService.forgotPassword(data.email);

        setIsLoading(false);
        if (result.success) {
            setIsSubmitted(true);
        } else {
            // Always show success to not reveal if email exists (security)
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-slate-300/20 dark:bg-slate-800/20 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">

                    {/* Branding */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                    </div>

                    {!isSubmitted ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-6">
                                    <span className="material-symbols-outlined text-4xl text-primary">lock_reset</span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    ¿Olvidaste tu contraseña?
                                </h1>
                                <p className="mt-3 text-slate-500 dark:text-slate-400">
                                    No te preocupes, te enviaremos las instrucciones para restablecerla.
                                </p>
                            </div>

                            {/* Form Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl dark:shadow-2xl">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                        <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                        <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl">mail</span>
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="nombre@empresa.com"
                                                className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                                    errors.email
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "border-slate-200 dark:border-slate-800"
                                                }`}
                                                {...register("email")}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Enviar instrucciones"
                                        )}
                                    </button>
                                </form>

                                {/* Divider + Back to Login */}
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
                                        Volver al login
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500/10 mb-6">
                                    <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    ¡Revisá tu correo!
                                </h1>
                                <p className="mt-3 text-slate-500 dark:text-slate-400">
                                    Si el email está registrado, enviamos un link de recuperación a tu casilla.
                                </p>
                            </div>

                            {/* Success Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl dark:shadow-2xl">
                                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-3 mb-6">
                                    <span className="material-symbols-outlined text-emerald-500 mt-0.5">info</span>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400/90">
                                        No olvides revisar la carpeta de spam si no lo encontrás en tu bandeja de entrada.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full flex justify-center py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    Volver a intentar
                                </button>

                                {/* Divider + Back to Login */}
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
                                        Volver al login
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer Links */}
                    <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-600 font-medium">
                        <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                            Política de Privacidad
                        </Link>
                        <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                            Términos de Servicio
                        </Link>
                        <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                            Centro de Ayuda
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}