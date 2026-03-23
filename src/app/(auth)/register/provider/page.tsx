"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/layout/logo";

// Step 1: Personal data
const step1Schema = z.object({
    firstName: z.string().min(2, { message: "Nombre requerido (mín. 2 caracteres)" }),
    lastName: z.string().min(2, { message: "Apellido requerido (mín. 2 caracteres)" }),
    email: z.string().email({ message: "Email invalido" }),
    phone: z.string().min(8, { message: "Telefono invalido" }),
    password: z.string()
        .min(8, { message: "Mín. 8 caracteres" })
        .regex(/[a-z]/, { message: "Debe tener minúscula" })
        .regex(/[A-Z]/, { message: "Debe tener mayúscula" })
        .regex(/[0-9]/, { message: "Debe tener número" })
        .regex(/[@$!%*?&]/, { message: "Debe tener especial (@$!%*?&)" }),
});

// Step 2: Professional profile
const step2Schema = z.object({
    category: z.string().min(1, { message: "Elegí una categoría" }),
    experience: z.string().min(1, { message: "Años de experiencia requeridos" }),
    description: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

const categories = [
    "Electricidad",
    "Plomería",
    "Limpieza",
    "Pintura",
    "Carpintería",
    "Jardinería",
    "Mudanzas",
    "Gasista",
    "Albañilería",
    "Cerrajería",
];

const stepsConfig = [
    { title: "Datos Personales", icon: "person" },
    { title: "Perfil Profesional", icon: "work" },
    { title: "Verificación", icon: "photo_camera" },
];

export default function ProviderRegisterPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { register: registerUser } = useAuth();

    // Step 1 form
    const step1Form = useForm<Step1Values>({
        resolver: zodResolver(step1Schema),
        mode: "onBlur",
    });

    // Step 2 form
    const step2Form = useForm<Step2Values>({
        resolver: zodResolver(step2Schema),
        mode: "onBlur",
    });

    const handleNext = async () => {
        if (step === 1) {
            const valid = await step1Form.trigger();
            if (valid) setStep(2);
        } else if (step === 2) {
            const valid = await step2Form.trigger();
            if (valid) setStep(3);
        }
    };

    const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setAuthError("El archivo no puede superar los 5MB");
                return;
            }
            setUploadedFile(file);
            setAuthError(null);
        }
    };

    const handleSubmitAll = async () => {
        setIsLoading(true);
        setAuthError(null);

        const personalData = step1Form.getValues();

        const result = await registerUser({
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            email: personalData.email,
            password: personalData.password,
            roles: ["PROVIDER"],
        });

        if (result.success) {
            router.push("/dashboard/proveedor/pendiente");
        } else {
            setAuthError(result.error || "Error al crear la cuenta");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -right-24 w-64 h-64 bg-slate-300/20 dark:bg-slate-800/20 rounded-full blur-3xl" />
            </div>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-xl w-full">
                    {/* Branding */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Registrate como profesional y empezá a recibir clientes.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl dark:shadow-2xl">

                        {/* Stepper */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center relative mb-8">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                                <div
                                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
                                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                                />

                                {stepsConfig.map((s, i) => (
                                    <div key={i} className="relative z-10 flex flex-col items-center">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                                            step > i + 1 ? "bg-primary border-primary text-white" :
                                                step === i + 1 ? "bg-white dark:bg-slate-900 border-primary text-primary shadow-md" :
                                                    "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"
                                        )}>
                                            {step > i + 1
                                                ? <span className="material-symbols-outlined text-xl">check</span>
                                                : <span className="material-symbols-outlined text-base">{s.icon}</span>}
                                        </div>
                                        <span className={cn(
                                            "absolute top-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider",
                                            step === i + 1 ? "text-primary" : "text-slate-400 dark:text-slate-500"
                                        )}>
                                            {s.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {stepsConfig[step - 1].title}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">Completá la información para que podamos conocerte.</p>

                            {authError && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                    <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{authError}</p>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-5 animate-fade-up">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Nombre"
                                            placeholder="Roberto"
                                            error={step1Form.formState.errors.firstName?.message}
                                            {...step1Form.register("firstName")}
                                        />
                                        <Input
                                            label="Apellido"
                                            placeholder="Gómez"
                                            error={step1Form.formState.errors.lastName?.message}
                                            {...step1Form.register("lastName")}
                                        />
                                    </div>
                                    <Input
                                        label="Email profesional"
                                        type="email"
                                        placeholder="roberto.gomez@mail.com"
                                        error={step1Form.formState.errors.email?.message}
                                        {...step1Form.register("email")}
                                    />
                                    <Input
                                        label="Teléfono de contacto"
                                        placeholder="+54 11 ...."
                                        error={step1Form.formState.errors.phone?.message}
                                        {...step1Form.register("phone")}
                                    />
                                    <Input
                                        label="Contraseña"
                                        type="password"
                                        placeholder="--------"
                                        error={step1Form.formState.errors.password?.message}
                                        {...step1Form.register("password")}
                                    />
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5 animate-fade-up">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Categoría principal</label>
                                        <select
                                            className={cn(
                                                "flex h-12 w-full rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all",
                                                step2Form.formState.errors.category
                                                    ? "border-red-500"
                                                    : "border-slate-200 dark:border-slate-700"
                                            )}
                                            {...step2Form.register("category")}
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        {step2Form.formState.errors.category && (
                                            <p className="text-xs text-red-500 font-medium ml-1">{step2Form.formState.errors.category.message}</p>
                                        )}
                                    </div>
                                    <Input
                                        label="Años de experiencia"
                                        placeholder="Ej: 10"
                                        error={step2Form.formState.errors.experience?.message}
                                        {...step2Form.register("experience")}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Descripción de tus servicios</label>
                                        <textarea
                                            className={cn(
                                                "flex min-h-[120px] w-full rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                                                step2Form.formState.errors.description
                                                    ? "border-red-500"
                                                    : "border-slate-200 dark:border-slate-700"
                                            )}
                                            placeholder="Contanos qué hacés, tus herramientas y qué te diferencia..."
                                            {...step2Form.register("description")}
                                        />
                                        {step2Form.formState.errors.description && (
                                            <p className="text-xs text-red-500 font-medium ml-1">{step2Form.formState.errors.description.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-fade-up">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "p-6 border-2 border-dashed rounded-xl text-center transition-colors group cursor-pointer",
                                            uploadedFile
                                                ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                                                : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                                        )}
                                    >
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500 group-hover:text-primary">
                                                {uploadedFile ? "check_circle" : "upload_file"}
                                            </span>
                                        </div>
                                        {uploadedFile ? (
                                            <>
                                                <h4 className="font-bold text-primary mb-1">Documento cargado</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)</p>
                                                <p className="text-xs text-primary font-medium mt-2">Clic para cambiar</p>
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Cargá tu Documento de Identidad</h4>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 px-8">Frente y dorso. Formatos permitidos: JPG, PNG, PDF. Max 5MB.</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-100 dark:border-amber-900/50">
                                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                                            <strong>Importante:</strong> Nuestro equipo revisará tus datos en un período de 24-48 hs hábiles. Una vez aprobada tu cuenta, recibirás un mail de bienvenida y podrás empezar a recibir clientes.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 flex gap-4">
                                {step > 1 && (
                                    <Button variant="outline" className="flex-1 h-14 rounded-xl gap-2" onClick={handlePrev}>
                                        <span className="material-symbols-outlined text-base">arrow_back</span> Anterior
                                    </Button>
                                )}
                                {step < 3 ? (
                                    <Button className="flex-1 h-14 rounded-xl gap-2 shadow-md" onClick={handleNext}>
                                        Siguiente <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    </Button>
                                ) : (
                                    <Button
                                        className="flex-1 h-14 rounded-xl gap-2 shadow-md"
                                        onClick={handleSubmitAll}
                                        isLoading={isLoading}
                                    >
                                        Enviar datos
                                    </Button>
                                )}
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                                ¿Preferís registrarte como cliente?{" "}
                                <Link href="/register" className="text-primary font-bold hover:underline">Clic acá</Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-600 font-medium">
                        <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Política de Privacidad</Link>
                        <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Términos de Servicio</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}