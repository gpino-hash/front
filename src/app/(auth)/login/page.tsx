"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/layout/logo";

const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setAuthError(null);

        const result = await login(data);

        if (result.requiresTwoFactor) {
            const params = new URLSearchParams({
                token: result.twoFactorToken || "",
                ...(redirectTo ? { redirect: redirectTo } : {}),
            });
            router.push(`/verify-2fa?${params.toString()}`);
            return;
        }

        if (result.success && result.user) {
            const isProvider = result.user.roles?.includes("PROVIDER");
            const destination = redirectTo
                || (isProvider ? "/dashboard/proveedor" : "/dashboard/cliente");
            router.push(destination);
        } else {
            setAuthError(result.error || "Credenciales inválidas");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-slate-300/20 dark:bg-slate-800/20 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">

                    {/* Branding */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Bienvenido de vuelta al marketplace de servicios
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl dark:shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            Iniciar Sesión
                        </h2>

                        {/* Auth Error */}
                        {authError && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{authError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Field */}
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

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl">lock</span>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                            errors.password
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-slate-200 dark:border-slate-800"
                                        }`}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Options Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-950"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500 dark:text-slate-400">
                                        Recordarme
                                    </label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Procesando...
                                    </>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs font-bold">
                                    O continuar con
                                </span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
                            >
                                <svg className="size-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
                            >
                                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Apple
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            ¿No tenés cuenta?{" "}
                            <Link
                                href="/register"
                                className="font-bold text-primary hover:text-primary-dark underline underline-offset-4 transition-colors"
                            >
                                Registrate
                            </Link>
                        </p>
                    </div>

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