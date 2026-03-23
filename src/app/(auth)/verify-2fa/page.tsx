"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth/auth-service";
import { Logo } from "@/components/layout/logo";
import Link from "next/link";

const CODE_LENGTH = 6;

export default function Verify2FAPage() {
    return (
        <Suspense>
            <Verify2FAForm />
        </Suspense>
    );
}

function Verify2FAForm() {
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);
    const [recoveryCode, setRecoveryCode] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshProfile } = useAuth();

    const token = searchParams.get("token") || "";
    const redirectTo = searchParams.get("redirect");

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleCodeChange = useCallback(
        (index: number, value: string) => {
            if (!/^\d*$/.test(value)) return;

            const newCode = [...code];
            // Handle paste of full code
            if (value.length > 1) {
                const digits = value.slice(0, CODE_LENGTH).split("");
                digits.forEach((d, i) => {
                    if (index + i < CODE_LENGTH) newCode[index + i] = d;
                });
                setCode(newCode);
                const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
                inputRefs.current[nextIndex]?.focus();
                return;
            }

            newCode[index] = value;
            setCode(newCode);
            if (value && index < CODE_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        },
        [code]
    );

    const handleKeyDown = useCallback(
        (index: number, e: React.KeyboardEvent) => {
            if (e.key === "Backspace" && !code[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        },
        [code]
    );

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
            if (!pastedData) return;
            const newCode = [...code];
            pastedData.split("").forEach((d, i) => {
                newCode[i] = d;
            });
            setCode(newCode);
            const focusIndex = Math.min(pastedData.length, CODE_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
        },
        [code]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const codeValue = useRecoveryCode ? recoveryCode.trim() : code.join("");

        if (!useRecoveryCode && codeValue.length !== CODE_LENGTH) {
            setError("Ingresá el código completo de 6 dígitos.");
            setIsLoading(false);
            return;
        }

        if (useRecoveryCode && !codeValue) {
            setError("Ingresá un código de recuperación.");
            setIsLoading(false);
            return;
        }

        const result = await authService.verify2FALogin(token, codeValue);

        if (result.success && result.user) {
            setIsSuccess(true);
            await refreshProfile();
            const isProvider = result.user.roles?.includes("PROVIDER");
            const destination = redirectTo || (isProvider ? "/dashboard/proveedor" : "/dashboard/cliente");
            setTimeout(() => router.push(destination), 1500);
        } else {
            setError(result.error || "Código inválido. Intentá nuevamente.");
            setCode(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;
        setResendCooldown(60);
        await authService.sendSms2FACode("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-blue-900/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-300/30 dark:bg-blue-800/10 blur-[120px] rounded-full" />
            </div>

            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">

                    {/* Branding / Shield Icon */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-primary/15 dark:bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 dark:border-blue-500/20 shadow-sm shadow-primary/10">
                            <span
                                className="material-symbols-outlined text-4xl text-primary dark:text-blue-400"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                shield
                            </span>
                        </div>
                        <Logo size="lg" />
                        <p className="text-slate-500 dark:text-slate-400 text-center mt-2">
                            Se requiere autenticación de dos factores
                        </p>
                    </div>

                    {/* Verification Card */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-300/70 dark:border-slate-800 rounded-xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-2xl">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {useRecoveryCode ? "Código de Recuperación" : "Verificá tu identidad"}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {useRecoveryCode
                                    ? "Ingresá uno de tus códigos de recuperación para acceder a tu cuenta."
                                    : "Ingresá el código enviado a tu dispositivo. Enviamos un código de verificación de 6 dígitos a tu número registrado."}
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {useRecoveryCode ? (
                                /* Recovery Code Input */
                                <div>
                                    <input
                                        type="text"
                                        value={recoveryCode}
                                        onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                                        placeholder="XXXX-XXXX-XXXX"
                                        autoFocus
                                        className="w-full text-center text-lg font-mono tracking-widest py-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all"
                                    />
                                </div>
                            ) : (
                                /* 6-Digit OTP Inputs */
                                <div className="flex justify-between gap-2 md:gap-3" onPaste={handlePaste}>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            autoFocus={index === 0}
                                            aria-label={`Dígito ${index + 1}`}
                                            className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all outline-none"
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-primary/20 dark:shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Verificando...
                                        </span>
                                    ) : (
                                        "Verificar"
                                    )}
                                </button>

                                {/* Actions */}
                                <div className="flex flex-col items-center gap-4 pt-4">
                                    {/* Resend code */}
                                    {!useRecoveryCode && (
                                        <button
                                            type="button"
                                            onClick={handleResendCode}
                                            disabled={resendCooldown > 0}
                                            className="text-primary dark:text-blue-400 hover:text-primary-dark dark:hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {resendCooldown > 0
                                                ? `Reenviar código en ${resendCooldown}s`
                                                : "Reenviar código"}
                                        </button>
                                    )}

                                    <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

                                    {/* Toggle method */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUseRecoveryCode(!useRecoveryCode);
                                            setError(null);
                                        }}
                                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
                                            {useRecoveryCode ? "smartphone" : "devices"}
                                        </span>
                                        {useRecoveryCode
                                            ? "Usar código de autenticación"
                                            : "Probar otro método"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Security Footer */}
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest font-semibold">
                            <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                verified_user
                            </span>
                            Encriptado de extremo a extremo
                        </div>

                        {/* Back to login */}
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mt-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </main>

            {/* Success Overlay */}
            {isSuccess && (
                <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-emerald-500 dark:text-green-400">
                                check_circle
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            ¡Verificación exitosa!
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Tu sesión está iniciada de forma segura en Taskao.
                        </p>
                        <div className="w-12 h-1 bg-primary mx-auto rounded-full overflow-hidden">
                            <div className="h-full bg-primary-light dark:bg-blue-400 animate-pulse w-full" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}