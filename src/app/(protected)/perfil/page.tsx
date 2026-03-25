"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth/auth-service";
import { TwoFactorSetup } from "@/components/auth/TwoFactorSetup";
import { TwoFactorDisable } from "@/components/auth/TwoFactorDisable";

// ── Schemas ──
const personalSchema = z.object({
    firstName: z.string().min(2, { message: "Mín. 2 caracteres" }),
    lastName: z.string().min(2, { message: "Mín. 2 caracteres" }),
    phone: z.string().min(8, { message: "Teléfono inválido" }).optional().or(z.literal("")),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Requerido" }),
    newPassword: z.string()
        .min(8, { message: "Mín. 8 caracteres" })
        .regex(/[a-z]/, { message: "Debe contener minúscula" })
        .regex(/[A-Z]/, { message: "Debe contener mayúscula" })
        .regex(/[0-9]/, { message: "Debe contener número" })
        .regex(/[@$!%*?&]/, { message: "Debe contener especial (@$!%*?&)" }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type PersonalFormValues = z.infer<typeof personalSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { user } = useAuth();
    const isProvider = user?.roles?.includes("PROVIDER");

    const tabs = [
        { id: "personal", label: "Datos personales" },
        { id: "security", label: "Seguridad" },
        ...(isProvider ? [{ id: "professional", label: "Perfil profesional" }] : []),
    ];

    const [activeTab, setActiveTab] = useState("personal");

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-48" />
                    <div className="h-64 bg-slate-100 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="size-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center ring-4 ring-white shadow-lg">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="size-16 rounded-full object-cover" />
                    ) : (
                        <span className="text-white text-xl font-bold">
                            {[user.firstName, user.lastName].filter(Boolean).map(n => n![0]).join("").toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-zinc-800">
                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Mi Perfil"}
                    </h1>
                    <p className="text-sm text-zinc-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                        {user.roles?.map((role) => (
                            <span key={role} className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {role}
                            </span>
                        ))}
                        {user.emailVerified ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified</span> Verificado
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">warning</span> Sin verificar
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

            {/* Tab Panels */}
            {activeTab === "personal" && <PersonalTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "professional" && isProvider && <ProfessionalTab />}
        </div>
    );
}

// ── Personal Tab ──
function PersonalTab() {
    const { user, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm<PersonalFormValues>({
        resolver: zodResolver(personalSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phone: user?.phone || "",
        },
    });

    const onSubmit = async (data: PersonalFormValues) => {
        if (!user) return;
        setIsLoading(true);
        setMessage(null);

        const result = await authService.updateProfile(user.id, {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || undefined,
        });

        setIsLoading(false);
        if (result.success) {
            setMessage({ type: "success", text: "Perfil actualizado correctamente" });
            await refreshProfile();
        } else {
            setMessage({ type: "error", text: result.error || "Error al actualizar" });
        }
    };

    return (
        <div role="tabpanel" id="tabpanel-personal" aria-labelledby="tab-personal">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-zinc-800 mb-6">Información personal</h3>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === "success" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                        <span className={`material-symbols-outlined text-xl mt-0.5 ${message.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
                            {message.type === "success" ? "check_circle" : "error"}
                        </span>
                        <p className={`text-sm font-medium ${message.type === "success" ? "text-emerald-700" : "text-red-700"}`}>{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Nombre"
                            error={errors.firstName?.message}
                            {...register("firstName")}
                        />
                        <Input
                            label="Apellido"
                            error={errors.lastName?.message}
                            {...register("lastName")}
                        />
                    </div>

                    <Input
                        label="Email"
                        value={user?.email || ""}
                        disabled
                        className="opacity-60"
                    />
                    <p className="text-xs text-zinc-400 -mt-4">El email no se puede cambiar directamente.</p>

                    <Input
                        label="Teléfono"
                        placeholder="+54 11 ...."
                        error={errors.phone?.message}
                        {...register("phone")}
                    />

                    {user?.createdAt && (
                        <p className="text-xs text-zinc-400">
                            Miembro desde {new Date(user.createdAt).toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
                        </p>
                    )}

                    <Button type="submit" className="h-12 rounded-xl" isLoading={isLoading} disabled={!isDirty}>
                        Guardar cambios
                    </Button>
                </form>
            </div>
        </div>
    );
}

// ── Security Tab ──
function SecurityTab() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [show2FADisable, setShow2FADisable] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordFormValues) => {
        setIsLoading(true);
        setMessage(null);

        const result = await authService.changePassword(data.currentPassword, data.newPassword);

        setIsLoading(false);
        if (result.success) {
            setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
            reset();
        } else {
            setMessage({ type: "error", text: result.error || "Error al cambiar la contraseña" });
        }
    };

    return (
        <div role="tabpanel" id="tabpanel-security" aria-labelledby="tab-security" className="space-y-6">
            {/* 2FA Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${user?.twoFactorEnabled ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                            <span
                                className="material-symbols-outlined text-2xl"
                                style={user?.twoFactorEnabled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {user?.twoFactorEnabled ? "verified_user" : "shield"}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-1">
                                Autenticación en Dos Pasos
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                                {user?.twoFactorEnabled
                                    ? "Tu cuenta está protegida con verificación en dos pasos."
                                    : "Agregá una capa extra de seguridad a tu cuenta."}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                                user?.twoFactorEnabled
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                            }`}>
                                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {user?.twoFactorEnabled ? "check_circle" : "warning"}
                                </span>
                                {user?.twoFactorEnabled ? "Activado" : "Desactivado"}
                            </span>
                        </div>
                    </div>

                    {user?.twoFactorEnabled ? (
                        <button
                            onClick={() => setShow2FADisable(true)}
                            className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shrink-0"
                        >
                            Desactivar
                        </button>
                    ) : (
                        <button
                            onClick={() => setShow2FASetup(true)}
                            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-md shrink-0 active:scale-[0.98]"
                        >
                            Activar 2FA
                        </button>
                    )}
                </div>

                {user?.twoFactorEnabled && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 opacity-60">
                        <div className="flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-slate-400 mb-1 text-lg">encrypted</span>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Encriptado</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-slate-400 mb-1 text-lg">verified</span>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Verificado</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-slate-400 mb-1 text-lg">gpp_good</span>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Protegido</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Password Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">Cambiar contraseña</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Actualizá tu contraseña para mantener tu cuenta segura.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === "success" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                        <span className={`material-symbols-outlined text-xl mt-0.5 ${message.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
                            {message.type === "success" ? "check_circle" : "error"}
                        </span>
                        <p className={`text-sm font-medium ${message.type === "success" ? "text-emerald-700" : "text-red-700"}`}>{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Contraseña actual"
                        type="password"
                        placeholder="--------"
                        error={errors.currentPassword?.message}
                        {...register("currentPassword")}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Nueva contraseña"
                            type="password"
                            placeholder="--------"
                            error={errors.newPassword?.message}
                            {...register("newPassword")}
                        />
                        <Input
                            label="Confirmar nueva"
                            type="password"
                            placeholder="--------"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        8+ chars, mayúscula, minúscula, número y especial (@$!%*?&)
                    </p>

                    <Button type="submit" className="h-12 rounded-xl" isLoading={isLoading}>
                        Actualizar contraseña
                    </Button>
                </form>
            </div>

            {/* Connected Accounts */}
            <ConnectedAccountsSection />

            {/* 2FA Modals */}
            {show2FASetup && <TwoFactorSetup onClose={() => setShow2FASetup(false)} />}
            {show2FADisable && <TwoFactorDisable onClose={() => setShow2FADisable(false)} />}
        </div>
    );
}

// ── Connected Accounts Section ──
function ConnectedAccountsSection() {
    const { user, refreshProfile } = useAuth();
    const [unlinkLoading, setUnlinkLoading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);
    const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const isGoogleLinked = !!user?.googleId;
    const canUnlink = user?.hasPassword !== false;

    const handleLinkGoogle = () => {
        setLinkLoading(true);
        window.location.href = authService.getGoogleLinkUrl();
    };

    const handleUnlinkGoogle = async () => {
        setUnlinkLoading(true);
        setMessage(null);
        const result = await authService.unlinkGoogle();
        setUnlinkLoading(false);
        if (result.success) {
            setMessage({ type: "success", text: "Cuenta de Google desvinculada correctamente" });
            setShowUnlinkConfirm(false);
            await refreshProfile();
        } else {
            setMessage({ type: "error", text: result.error || "Error al desvincular" });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">Cuentas vinculadas</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Gestioná tus cuentas de inicio de sesión social.</p>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === "success" ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"}`}>
                    <span className={`material-symbols-outlined text-xl mt-0.5 ${message.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
                        {message.type === "success" ? "check_circle" : "error"}
                    </span>
                    <p className={`text-sm font-medium ${message.type === "success" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{message.text}</p>
                </div>
            )}

            {/* Google */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                    <svg className="size-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-white">Google</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {isGoogleLinked ? "Cuenta vinculada" : "No vinculada"}
                        </p>
                    </div>
                    {isGoogleLinked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Conectada
                        </span>
                    )}
                </div>

                {isGoogleLinked ? (
                    <button
                        onClick={() => setShowUnlinkConfirm(true)}
                        disabled={!canUnlink}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!canUnlink ? "Configurá una contraseña primero" : "Desvincular cuenta de Google"}
                    >
                        Desvincular
                    </button>
                ) : (
                    <button
                        onClick={handleLinkGoogle}
                        disabled={linkLoading}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        {linkLoading ? (
                            <span className="flex items-center gap-1">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Vinculando...
                            </span>
                        ) : (
                            "Vincular"
                        )}
                    </button>
                )}
            </div>

            {/* Unlink Confirmation */}
            {showUnlinkConfirm && (
                <div className="mt-4 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                        {canUnlink
                            ? "¿Estás seguro de que querés desvincular tu cuenta de Google?"
                            : "No podés desvincular Google porque es tu único método de inicio de sesión. Configurá una contraseña primero."
                        }
                    </p>
                    <div className="flex gap-2">
                        {canUnlink && (
                            <button
                                onClick={handleUnlinkGoogle}
                                disabled={unlinkLoading}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {unlinkLoading ? (
                                    <span className="flex items-center gap-1">
                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Desvinculando...
                                    </span>
                                ) : (
                                    "Sí, desvincular"
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => setShowUnlinkConfirm(false)}
                            className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Professional Tab (Provider only) ──
function ProfessionalTab() {
    return (
        <div role="tabpanel" id="tabpanel-professional" aria-labelledby="tab-professional">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-zinc-800 mb-2">Perfil profesional</h3>
                <p className="text-sm text-zinc-500 mb-6">Información sobre tu actividad como proveedor.</p>

                <div className="bg-slate-50 rounded-xl p-6 text-center">
                    <span className="material-symbols-outlined text-4xl text-zinc-300 mb-4">construction</span>
                    <p className="text-sm text-zinc-500 font-medium">
                        La edición del perfil profesional estará disponible en el próximo sprint.
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                        Podrás gestionar: categoría, descripción, galería, y zonas de cobertura.
                    </p>
                </div>
            </div>
        </div>
    );
}