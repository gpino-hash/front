"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth/auth-service";

export function VerificationBanner() {
    const { user } = useAuth();
    const [dismissed, setDismissed] = useState(false);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    // Don't show if user is verified, not logged in, or dismissed
    if (!user || user.emailVerified || dismissed) return null;

    const handleResend = async () => {
        setResending(true);
        // Use forgot-password endpoint as a workaround for resend verification
        // TODO: Add dedicated resend-verification endpoint in auth-service
        await authService.forgotPassword(user.email);
        setResending(false);
        setResent(true);
    };

    return (
        <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">warning</span>
                    <p className="text-sm text-amber-800 font-medium truncate">
                        Verificá tu email para acceder a todas las funciones.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {resent ? (
                        <span className="text-xs font-bold text-primary">Email enviado</span>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-xs font-bold text-amber-700 hover:text-primary underline transition-colors disabled:opacity-50"
                        >
                            {resending ? "Enviando..." : "Reenviar email"}
                        </button>
                    )}
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-amber-400 hover:text-amber-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
}