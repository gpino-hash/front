"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import { authService } from "@/lib/auth/auth-service";
import { useAuth } from "@/hooks/useAuth";
import type { TwoFactorMethod } from "@/lib/auth/types";

type SetupStep = "select-method" | "setup-authenticator" | "setup-sms" | "verify-code" | "recovery-codes" | "success";

const CODE_LENGTH = 6;

export function TwoFactorSetup({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<SetupStep>("select-method");
    const [method, setMethod] = useState<TwoFactorMethod>("authenticator");
    const [secret, setSecret] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { user, refreshProfile } = useAuth();

    // Generate QR code image from secret
    useEffect(() => {
        if (!secret || method !== "authenticator") return;

        const userEmail = user?.email || "user";
        const otpauthUri = `otpauth://totp/Taskao:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=Taskao&digits=6&period=30`;

        QRCode.toDataURL(otpauthUri, {
            width: 200,
            margin: 2,
            color: { dark: "#1e293b", light: "#ffffff" },
        })
            .then(setQrDataUrl)
            .catch(() => setQrDataUrl(""));
    }, [secret, method, user?.email]);

    const handleMethodSelect = async () => {
        setIsLoading(true);
        setError(null);

        const result = await authService.setup2FA(method);

        if (result.success) {
            setSecret(result.secret);
            setStep(method === "authenticator" ? "setup-authenticator" : "setup-sms");
        } else {
            setError(result.error || "Error al configurar 2FA.");
        }
        setIsLoading(false);
    };

    const handleSendSmsCode = async () => {
        if (!phone.trim()) {
            setError("Ingresá tu número de teléfono.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const result = await authService.sendSms2FACode(phone);
        if (result.success) {
            setStep("verify-code");
        } else {
            setError(result.error || "Error al enviar SMS.");
        }
        setIsLoading(false);
    };

    const handleCodeChange = useCallback(
        (index: number, value: string) => {
            if (!/^\d*$/.test(value)) return;

            const newCode = [...code];
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
            const newCode = Array(CODE_LENGTH).fill("");
            pastedData.split("").forEach((d, i) => {
                newCode[i] = d;
            });
            setCode(newCode);
            const focusIndex = Math.min(pastedData.length, CODE_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
        },
        []
    );

    const handleVerifyCode = async () => {
        const codeValue = code.join("");
        if (codeValue.length !== CODE_LENGTH) {
            setError("Ingresá el código completo de 6 dígitos.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await authService.verify2FASetup(codeValue);

        if (result.success) {
            setRecoveryCodes(result.recoveryCodes || []);
            setStep("recovery-codes");
            await refreshProfile();
        } else {
            setError(result.error || "Código inválido.");
            setCode(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        }
        setIsLoading(false);
    };

    const copyToClipboard = async (text: string, type: "secret" | "codes") => {
        await navigator.clipboard.writeText(text);
        if (type === "secret") {
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        } else {
            setCopiedCodes(true);
            setTimeout(() => setCopiedCodes(false), 2000);
        }
    };

    const downloadRecoveryCodes = () => {
        const content = [
            "Taskao - Códigos de Recuperación 2FA",
            "=====================================",
            `Fecha: ${new Date().toLocaleDateString("es-AR")}`,
            "",
            "Guardá estos códigos en un lugar seguro.",
            "Cada código solo se puede usar una vez.",
            "",
            ...recoveryCodes.map((c, i) => `${i + 1}. ${c}`),
        ].join("\n");

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "taskao-recovery-codes.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-primary rounded-lg">
                            <span className="material-symbols-outlined">lock_person</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {step === "select-method" && "Autenticación en Dos Pasos"}
                                {step === "setup-authenticator" && "Configurar Authenticator"}
                                {step === "setup-sms" && "Verificación por SMS"}
                                {step === "verify-code" && "Verificar Código"}
                                {step === "recovery-codes" && "Códigos de Recuperación"}
                                {step === "success" && "2FA Activado"}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {step === "select-method" && "Elegí cómo verificar tu identidad"}
                                {step === "setup-authenticator" && "Escaneá el código QR"}
                                {step === "setup-sms" && "Ingresá tu número de teléfono"}
                                {step === "verify-code" && "Confirmá la configuración"}
                                {step === "recovery-codes" && "Guardá estos códigos de forma segura"}
                                {step === "success" && "Tu cuenta está protegida"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Cerrar"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Step: Select Method */}
                    {step === "select-method" && (
                        <div className="space-y-4">
                            {/* Authenticator Option */}
                            <label
                                className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    method === "authenticator"
                                        ? "border-primary bg-blue-50/50 dark:bg-blue-950/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="2fa_method"
                                    value="authenticator"
                                    checked={method === "authenticator"}
                                    onChange={() => setMethod("authenticator")}
                                    className="peer absolute top-4 right-4 h-5 w-5 text-primary border-slate-300 focus:ring-primary"
                                />
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/40 text-primary rounded-lg group-hover:scale-110 transition-transform shrink-0">
                                        <span className="material-symbols-outlined text-2xl">phonelink_setup</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                                            Aplicación de Autenticación
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Usá Google Authenticator, Microsoft Authenticator u otra app compatible para generar códigos seguros.
                                        </p>
                                        <div className="mt-2 flex items-center text-xs font-bold text-primary">
                                            <span>RECOMENDADO</span>
                                            <span className="ml-1.5 material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {/* SMS Option */}
                            <label
                                className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    method === "sms"
                                        ? "border-primary bg-blue-50/50 dark:bg-blue-950/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="2fa_method"
                                    value="sms"
                                    checked={method === "sms"}
                                    onChange={() => setMethod("sms")}
                                    className="peer absolute top-4 right-4 h-5 w-5 text-primary border-slate-300 focus:ring-primary"
                                />
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-primary rounded-lg group-hover:scale-110 transition-transform shrink-0">
                                        <span className="material-symbols-outlined text-2xl">sms</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                                            Mensaje SMS
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Recibí un código de verificación de 6 dígitos por mensaje de texto a tu celular.
                                        </p>
                                        <div className="mt-2 flex items-center text-xs font-bold text-slate-400">
                                            <span>SEGURIDAD ESTÁNDAR</span>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {/* Info */}
                            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <span className="material-symbols-outlined text-slate-400 text-xl mt-0.5">info</span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    La autenticación en dos pasos agrega una capa extra de seguridad. Además de tu contraseña,
                                    necesitarás un código temporal para iniciar sesión.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step: Setup Authenticator */}
                    {step === "setup-authenticator" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Escaneá este código QR con tu aplicación de autenticación:
                                </p>

                                {/* QR Code */}
                                <div className="inline-flex items-center justify-center p-4 bg-white rounded-xl border border-slate-200 mb-4">
                                    {qrDataUrl ? (
                                        <img
                                            src={qrDataUrl}
                                            alt="Código QR para configurar 2FA"
                                            className="w-48 h-48"
                                        />
                                    ) : (
                                        <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-lg">
                                            <span className="material-symbols-outlined text-5xl text-slate-300 animate-pulse">qr_code_2</span>
                                        </div>
                                    )}
                                </div>

                                {/* Manual entry */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        O ingresá este código manualmente:
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <code className="text-sm font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 select-all">
                                            {secret || "XXXX XXXX XXXX XXXX"}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(secret, "secret")}
                                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                            aria-label="Copiar código"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                {copiedSecret ? "check" : "content_copy"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                Una vez configurado, hacé clic en <strong>Continuar</strong> para verificar el código.
                            </p>
                        </div>
                    )}

                    {/* Step: Setup SMS */}
                    {step === "setup-sms" && (
                        <div className="space-y-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Ingresá tu número de teléfono para recibir códigos de verificación por SMS.
                            </p>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Número de teléfono
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">phone</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+54 11 1234-5678"
                                        autoFocus
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">warning</span>
                                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                    La verificación por SMS es menos segura que una app de autenticación. Los mensajes pueden ser
                                    interceptados. Recomendamos usar una app cuando sea posible.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step: Verify Code */}
                    {step === "verify-code" && (
                        <div className="space-y-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                {method === "authenticator"
                                    ? "Ingresá el código de 6 dígitos que muestra tu aplicación de autenticación:"
                                    : "Ingresá el código de 6 dígitos que recibiste por SMS:"}
                            </p>

                            {/* OTP Inputs */}
                            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
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
                                        className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    />
                                ))}
                            </div>

                            {method === "sms" && (
                                <p className="text-xs text-center text-slate-400">
                                    El código fue enviado a <span className="font-medium text-slate-600 dark:text-slate-300">{phone}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step: Recovery Codes */}
                    {step === "recovery-codes" && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">warning</span>
                                <div>
                                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">
                                        Guardá estos códigos de recuperación
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                        Si perdés acceso a tu dispositivo de autenticación, podés usar estos códigos para iniciar sesión.
                                        Cada código solo se puede usar una vez. Guardalos en un lugar seguro.
                                    </p>
                                </div>
                            </div>

                            {/* Codes Grid */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {recoveryCodes.map((recoveryCode, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700"
                                        >
                                            <span className="text-xs text-slate-400 font-mono">{index + 1}.</span>
                                            <code className="text-sm font-mono font-bold text-slate-900 dark:text-white select-all">
                                                {recoveryCode}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => copyToClipboard(recoveryCodes.join("\n"), "codes")}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {copiedCodes ? "check" : "content_copy"}
                                    </span>
                                    {copiedCodes ? "Copiados" : "Copiar"}
                                </button>
                                <button
                                    onClick={downloadRecoveryCodes}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Descargar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step: Success */}
                    {step === "success" && (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check_circle
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    2FA Activado Exitosamente
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Tu cuenta ahora está protegida con autenticación en dos pasos.
                                    La próxima vez que inicies sesión, necesitarás un código de verificación.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-2 opacity-60">
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-slate-400 mb-1">encrypted</span>
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Encriptado</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-slate-400 mb-1">verified</span>
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Verificado</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-slate-400 mb-1">gpp_good</span>
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Protegido</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-4 p-6 border-t border-slate-200 dark:border-slate-800">
                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5">
                        {["select-method", "setup-authenticator", "verify-code", "recovery-codes", "success"].map((s, i) => {
                            const steps: SetupStep[] = method === "authenticator"
                                ? ["select-method", "setup-authenticator", "verify-code", "recovery-codes", "success"]
                                : ["select-method", "setup-sms", "verify-code", "recovery-codes", "success"];
                            const currentIndex = steps.indexOf(step);
                            return (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all ${
                                        i <= currentIndex
                                            ? "w-6 bg-primary"
                                            : "w-1.5 bg-slate-200 dark:bg-slate-700"
                                    }`}
                                />
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        {step !== "success" && (
                            <button
                                onClick={() => {
                                    if (step === "select-method") {
                                        onClose();
                                    } else if (step === "setup-authenticator" || step === "setup-sms") {
                                        setStep("select-method");
                                        setError(null);
                                    } else if (step === "verify-code") {
                                        setStep(method === "authenticator" ? "setup-authenticator" : "setup-sms");
                                        setCode(Array(CODE_LENGTH).fill(""));
                                        setError(null);
                                    } else if (step === "recovery-codes") {
                                        // Can't go back from here
                                    }
                                }}
                                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                {step === "select-method" ? "Cancelar" : "Atrás"}
                            </button>
                        )}

                        {step === "select-method" && (
                            <button
                                onClick={handleMethodSelect}
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Configurando...
                                    </span>
                                ) : (
                                    "Continuar"
                                )}
                            </button>
                        )}

                        {step === "setup-authenticator" && (
                            <button
                                onClick={() => {
                                    setStep("verify-code");
                                    setCode(Array(CODE_LENGTH).fill(""));
                                }}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md active:scale-[0.98]"
                            >
                                Continuar
                            </button>
                        )}

                        {step === "setup-sms" && (
                            <button
                                onClick={handleSendSmsCode}
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Enviando...
                                    </span>
                                ) : (
                                    "Enviar Código"
                                )}
                            </button>
                        )}

                        {step === "verify-code" && (
                            <button
                                onClick={handleVerifyCode}
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Verificando...
                                    </span>
                                ) : (
                                    "Verificar"
                                )}
                            </button>
                        )}

                        {step === "recovery-codes" && (
                            <button
                                onClick={() => setStep("success")}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md active:scale-[0.98]"
                            >
                                Ya los guardé
                            </button>
                        )}

                        {step === "success" && (
                            <button
                                onClick={onClose}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md active:scale-[0.98]"
                            >
                                Listo
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}