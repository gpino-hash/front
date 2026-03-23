"use client";

import { useState } from "react";
import { authService } from "@/lib/auth/auth-service";
import { useAuth } from "@/hooks/useAuth";

export function TwoFactorDisable({ onClose }: { onClose: () => void }) {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshProfile } = useAuth();

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            setError("Ingresá tu contraseña para confirmar.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await authService.disable2FA(password);

        if (result.success) {
            await refreshProfile();
            onClose();
        } else {
            setError(result.error || "No se pudo desactivar 2FA.");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                            <span className="material-symbols-outlined">shield</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Desactivar 2FA
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Tu cuenta será menos segura
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
                <form onSubmit={handleDisable} className="p-6 space-y-6">
                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">warning</span>
                        <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                            Desactivar la autenticación en dos pasos hará que tu cuenta sea más vulnerable.
                            Solo necesitarás tu contraseña para iniciar sesión.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Confirmá tu contraseña
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tu contraseña actual"
                                autoFocus
                                className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Desactivando...
                                </span>
                            ) : (
                                "Desactivar 2FA"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}