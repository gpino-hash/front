"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth/auth-service";

const resetSchema = z.object({
    password: z.string()
        .min(8, { message: "Mín. 8 caracteres" })
        .regex(/[a-z]/, { message: "Debe contener minúscula" })
        .regex(/[A-Z]/, { message: "Debe contener mayúscula" })
        .regex(/[0-9]/, { message: "Debe contener número" })
        .regex(/[@$!%*?&]/, { message: "Debe contener especial (@$!%*?&)" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}

function ResetPasswordForm() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetFormValues) => {
        if (!token) {
            setError("Link de recuperación inválido. Solicitá uno nuevo.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await authService.resetPassword(token, data.password);

        setIsLoading(false);
        if (result.success) {
            setIsSuccess(true);
        } else {
            setError(result.error || "Error al restablecer la contraseña");
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center mx-auto mb-8">
                        <span className="material-symbols-outlined text-3xl text-red-500">link_off</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Link inválido</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                        El link de recuperación es inválido o expiró. Solicitá uno nuevo.
                    </p>
                    <Link href="/forgot-password">
                        <Button className="w-full h-14 rounded-xl text-lg shadow-md">
                            Solicitar nuevo link
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                {!isSuccess ? (
                    <div className="animate-fade-up">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8">
                            <span className="material-symbols-outlined text-3xl">key</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Nueva contraseña</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                            Ingresá tu nueva contraseña para volver a acceder a Taskao.
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <div>
                                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                                    {error.includes("expiró") && (
                                        <Link href="/forgot-password" className="text-xs text-red-600 dark:text-red-400 font-bold underline mt-1 inline-block">
                                            Solicitar nuevo link
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Nueva contraseña"
                                type="password"
                                placeholder="--------"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                            <Input
                                label="Confirmar contraseña"
                                type="password"
                                placeholder="--------"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                            />
                            <Button type="submit" className="w-full h-14 rounded-xl text-lg shadow-md" isLoading={isLoading}>
                                Restablecer contraseña
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="text-center animate-fade-up">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white mb-8 mx-auto shadow-md">
                            <span className="material-symbols-outlined text-3xl">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">¡Todo listo!</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                            Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión con tus nuevas credenciales.
                        </p>
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