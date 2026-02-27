"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const registerSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    email: z.string().email({ message: "Email invalido" }),
    phone: z.string().min(8, { message: "Telefono invalido" }),
    password: z.string().min(8, { message: "La contrasena debe tener al menos 8 caracteres" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

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
        console.log(data);
        setTimeout(() => setIsLoading(false), 2000);
    };

    const password = watch("password", "");
    const hasMinLength = password.length >= 8;
    const hasChar = /[a-zA-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
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
                        Descubri la nueva forma de <span className="text-primary">contratar</span> expertos.
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-md">
                        Miles de clientes ya confian en Profesio para sus proyectos diarios.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined text-primary text-base">shield</span>
                    Resguardamos tu seguridad en cada paso
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-background-light">
                <div className="max-w-md w-full mx-auto">
                    <div className="md:hidden flex items-center gap-2 mb-12">
                        <div className="size-8 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-slate-900">Profesio</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 mb-2">Crea tu cuenta</h2>
                        <p className="text-zinc-500 font-medium">Busca los mejores profesionales para tu hogar.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Nombre completo"
                            placeholder="Juan Perez"
                            error={errors.name?.message}
                            {...register("name")}
                        />
                        <Input
                            label="Correo electronico"
                            type="email"
                            placeholder="tu@email.com"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <Input
                            label="Telefono"
                            placeholder="+54 11 ...."
                            error={errors.phone?.message}
                            {...register("phone")}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Contrasena"
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
                        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-1 flex-1 rounded-full transition-colors ${hasMinLength ? 'bg-primary' : 'bg-zinc-200'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-colors ${hasChar ? 'bg-primary' : 'bg-zinc-200'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-colors ${hasNum ? 'bg-primary' : 'bg-zinc-200'}`} />
                            </div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Requisitos: 8+ caracteres, letra y numero</p>
                        </div>

                        <Button type="submit" className="w-full h-14 rounded-xl text-lg" isLoading={isLoading}>
                            Crear cuenta
                        </Button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-border-light"></div>
                            <div className="flex-grow border-t border-border-light"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button" className="h-12 rounded-xl text-zinc-600 gap-2 border-border-light">
                                <span className="material-symbols-outlined text-red-500 text-xl">mail</span>
                                Google
                            </Button>
                            <Button variant="outline" type="button" className="h-12 rounded-xl text-zinc-600 gap-2 border-border-light">
                                <span className="material-symbols-outlined text-blue-600 text-xl">facebook</span>
                                Facebook
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-sm text-slate-700 font-medium text-center">
                            Queres ofrecer tus servicios?{" "}
                            <Link href="/register/provider" className="font-bold underline text-primary">Registrate como profesional</Link>
                        </p>
                    </div>

                    <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
                        Ya tenes cuenta?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline">Iniciar sesion</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
