"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().email({ message: "Email invalido" }),
    password: z.string().min(6, { message: "La contrasena debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        console.log(data);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side: Branding */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 lg:p-20">
                <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
                    <div className="size-9 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-3xl font-black text-white"> Profesio </span>
                </Link>

                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                        Los mejores <span className="text-primary">profesionales</span> están acá.
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-md">
                        Unite a la comunidad de servicios más confiable de LATAM.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined text-primary text-base">shield</span>
                    Plataforma 100% segura
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-background-light">
                <div className="max-w-md w-full mx-auto">
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center gap-2 mb-12">
                        <div className="size-8 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-slate-900">Profesio</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 mb-2">¡Hola de nuevo!</h2>
                        <p className="text-zinc-500 font-medium">Ingresá tus datos para acceder a tu cuenta.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            placeholder="tu@email.com"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <div className="space-y-2">
                            <Input
                                label="Contraseña"
                                type="password"
                                placeholder="--------"
                                autoComplete="current-password"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-14 rounded-xl text-lg" isLoading={isLoading}>
                            Iniciar sesión
                        </Button>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-border-light"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">o continuar con</span>
                            <div className="flex-grow border-t border-border-light"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button" className="h-12 rounded-xl text-zinc-600 gap-2 border-border-light">
                                <svg className="size-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" type="button" className="h-12 rounded-xl text-zinc-600 gap-2 border-border-light">
                                <svg className="size-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-zinc-500 font-medium">
                        ¿No tenés cuenta?{" "}
                        <Link href="/register" className="text-primary font-bold hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
