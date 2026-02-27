"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const forgotSchema = z.object({
    email: z.string().email({ message: "Email invalido" }),
});

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true);
        console.log(data);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                <Link href="/login" className="inline-flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors mb-12">
                    <span className="material-symbols-outlined text-base">arrow_back</span> Volver al login
                </Link>

                {!isSubmitted ? (
                    <div className="animate-fade-up">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8">
                            <span className="material-symbols-outlined text-3xl">mail</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-800 mb-4">Olvidaste tu contrasena?</h1>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed"> No te preocupes, suele pasar. Ingresa tu mail y te enviaremos las instrucciones para restablecerla. </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Correo electronico"
                                placeholder="tu@email.com"
                                error={errors.email?.message as string}
                                {...register("email")}
                            />
                            <Button type="submit" className="w-full h-14 rounded-xl text-lg shadow-md" isLoading={isLoading}>
                                Enviar instrucciones
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="text-center animate-fade-up">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white mb-8 mx-auto shadow-md">
                            <span className="material-symbols-outlined text-3xl">mail</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-800 mb-4">Revisa tu correo!</h1>
                        <p className="text-zinc-500 mb-8 font-medium leading-relaxed"> Enviamos un link de recuperacion a tu casilla de correo electronico. No olvides revisar la carpeta de SPAM. </p>
                        <Button variant="outline" className="w-full h-14 rounded-xl text-lg" onClick={() => setIsSubmitted(false)}>
                            Volver a intentar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}