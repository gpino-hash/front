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

            {/* 2FA Modals */}
            {show2FASetup && <TwoFactorSetup onClose={() => setShow2FASetup(false)} />}
            {show2FADisable && <TwoFactorDisable onClose={() => setShow2FADisable(false)} />}
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