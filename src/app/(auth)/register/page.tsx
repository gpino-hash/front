"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth/auth-service";
import { Logo } from "@/components/layout/logo";

const registerSchema = z.object({
    firstName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Email invalido" }),
    phone: z.string().min(8, { message: "Telefono invalido" }),
    password: z.string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/[a-z]/, { message: "Debe contener al menos una minúscula" })
        .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
        .regex(/[0-9]/, { message: "Debe contener al menos un número" })
        .regex(/[@$!%*?&]/, { message: "Debe contener al menos un carácter especial (@$!%*?&)" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const { register: registerUser } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setAuthError(null);

        const result = await registerUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            roles: ["CLIENT"],
        });

        if (result.success) {
            router.push("/dashboard/cliente");
        } else {
            setAuthError(result.error || "Error al crear la cuenta");
            setIsLoading(false);
        }
    };

    const password = watch("password", "");
    const hasMinLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const strengthCount = [hasMinLength, hasLower, hasUpper, hasNum, hasSpecial].filter(Boolean).length;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -right-24 w-64 h-64 bg-slate-300/20 dark:bg-slate-800/20 rounded-full blur-3xl" />
            </div>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-lg w-full">
                    {/* Branding */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Creá tu cuenta para encontrar profesionales de confianza.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-300/70 dark:border-slate-800 rounded-xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            Crear Cuenta
                        </h2>

                        {authError && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{authError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre"
                                    placeholder="Juan"
                                    error={errors.firstName?.message}
                                    {...register("firstName")}
                                />
                                <Input
                                    label="Apellido"
                                    placeholder="Perez"
                                    error={errors.lastName?.message}
                                    {...register("lastName")}
                                />
                            </div>
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="tu@email.com"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                            <Input
                                label="Teléfono"
                                placeholder="+54 11 ...."
                                error={errors.phone?.message}
                                {...register("phone")}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Contraseña"
                                    type="password"
                                    placeholder="--------"
                                    error={errors.password?.message}
                                    {...register("password")}
                                />
                                <Input
                                    label="Confirmar"
                                    type="password"
                                    placeholder="--------"
                                    error={errors.confirmPassword?.message}
                                    {...register("confirmPassword")}
                                />
                            </div>

                            {/* Password Strength */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${strengthCount >= i ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    8+ chars, mayúscula, minúscula, número y especial (@$!%*?&)
                                </p>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-xl text-lg" isLoading={isLoading}>
                                Crear cuenta
                            </Button>

                            {/* Divider */}
                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                                <span className="mx-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">o</span>
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-12 rounded-xl gap-2"
                                    disabled={isGoogleLoading || isLoading}
                                    onClick={() => {
                                        setIsGoogleLoading(true);
                                        window.location.href = authService.getGoogleAuthUrl();
                                    }}
                                >
                                    {isGoogleLoading ? (
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                                    ) : (
                                        <svg className="size-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    )}
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-12 rounded-xl gap-2"
                                    disabled
                                    title="Próximamente"
                                >
                                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Apple
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20">
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium text-center">
                                ¿Querés ofrecer tus servicios?{" "}
                                <Link href="/register/provider" className="font-bold underline text-primary">Registrate como profesional</Link>
                            </p>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            ¿Ya tenés cuenta?{" "}
                            <Link href="/login" className="font-bold text-primary hover:text-primary-dark underline underline-offset-4 transition-colors">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-600 font-medium">
                        <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Política de Privacidad</Link>
                        <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Términos de Servicio</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}