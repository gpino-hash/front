"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const resetSchema = z.object({
    password: z.string().min(8, { message: "La contrasena debe tener al menos 8 caracteres" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                {!isSuccess ? (
                    <div className="animate-fade-up">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8">
                            <span className="material-symbols-outlined text-3xl">key</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-800 mb-4">Nueva contrasena</h1>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed"> Por favor, ingresa tu nueva contrasena para volver a acceder a Profesio. </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Nueva contrasena"
                                type="password"
                                placeholder="--------"
                                error={errors.password?.message as string}
                                {...register("password")}
                            />
                            <Input
                                label="Confirmar contrasena"
                                type="password"
                                placeholder="--------"
                                error={errors.confirmPassword?.message as string}
                                {...register("confirmPassword")}
                            />
                            <Button type="submit" className="w-full h-14 rounded-xl text-lg shadow-md" isLoading={isLoading}>
                                Restablecer contrasena
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="text-center animate-fade-up">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white mb-8 mx-auto shadow-md">
                            <span className="material-symbols-outlined text-3xl">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-800 mb-4">Todo listo!</h1>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed"> Tu contrasena fue actualizada correctamente. Ya podes iniciar sesion con tus nuevas credenciales. </p>
                        <Link href="/login">
                            <Button className="w-full h-14 rounded-xl text-lg shadow-md">
                                Ir al login
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}