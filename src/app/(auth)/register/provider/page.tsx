"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const providerSchema = z.object({
    name: z.string().min(3, { message: "Nombre requerido" }),
    email: z.string().email({ message: "Email invalido" }),
    phone: z.string().min(8, { message: "Telefono invalido" }),
    category: z.string().min(1, { message: "Elegi una categoria" }),
    experience: z.string().min(1, { message: "Anos de experiencia requeridos" }),
    description: z.string().min(20, { message: "La descripcion debe ser mas larga" }),
});

export default function ProviderRegisterPage() {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const steps = [
        { title: "Datos Personales", icon: <span className="material-symbols-outlined text-base">person</span> },
        { title: "Perfil Profesional", icon: <span className="material-symbols-outlined text-base">work</span> },
        { title: "Verificacion", icon: <span className="material-symbols-outlined text-base">photo_camera</span> },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/3 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
                <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
                    <div className="size-9 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-2xl font-black text-white"> Profesio </span>
                </Link>

                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                        Hace crecer tu <span className="text-primary">negocio</span> hoy.
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Unite a la mayor red de profesionales de Argentina y empeza a recibir clientes calificados.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-xl">check</span>
                        </div>
                        <p className="text-sm text-slate-300">Pagos garantizados en cada servicio.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-xl">check</span>
                        </div>
                        <p className="text-sm text-slate-300">Perfil verificado para mayor confianza.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-6 py-12 lg:px-24 bg-background-light overflow-y-auto">
                <div className="max-w-xl w-full mx-auto">
                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center relative mb-8">
                            {/* Line */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
                                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                            />

                            {steps.map((s, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                                        step > i + 1 ? "bg-primary border-primary text-white" :
                                            step === i + 1 ? "bg-white border-primary text-primary shadow-md" :
                                                "bg-white border-slate-200 text-zinc-400"
                                    )}>
                                        {step > i + 1 ? <span className="material-symbols-outlined text-xl">check</span> : s.icon}
                                    </div>
                                    <span className={cn(
                                        "absolute top-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider",
                                        step === i + 1 ? "text-primary" : "text-zinc-400"
                                    )}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-3xl font-extrabold text-zinc-800 mb-2">
                            {steps[step - 1].title}
                        </h2>
                        <p className="text-zinc-500 mb-10">Completa la informacion para que podamos conocerte.</p>

                        {step === 1 && (
                            <div className="space-y-6 animate-fade-up">
                                <Input label="Nombre y Apellido" placeholder="Ej: Roberto Gomez" />
                                <Input label="Email profesional" type="email" placeholder="roberto.gomez@mail.com" />
                                <Input label="Telefono de contacto" placeholder="+54 11 ...." />
                                <Input label="Contrasena" type="password" placeholder="--------" />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-fade-up">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-[0.1em] uppercase text-zinc-400">Categoria principal</label>
                                    <select className="flex h-12 w-full rounded-xl border border-border-light bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none">
                                        <option>Selecciona una categoria</option>
                                        <option>Electricidad</option>
                                        <option>Plomeria</option>
                                        <option>Limpieza</option>
                                        <option>Pintura</option>
                                    </select>
                                </div>
                                <Input label="Anos de experiencia" placeholder="Ej: 10 anos" />
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-[0.1em] uppercase text-zinc-400">Descripcion de tus servicios</label>
                                    <textarea className="flex min-h-[120px] w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Contanos que haces, tus herramientas y que te diferencia..." />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-fade-up">
                                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-primary/50 transition-colors group cursor-pointer">
                                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl text-zinc-400 group-hover:text-primary">upload_file</span>
                                    </div>
                                    <h4 className="font-bold text-zinc-800 mb-1">Carga tu Documento de Identidad</h4>
                                    <p className="text-xs text-zinc-400 px-8">Frente y dorso. Formatos permitidos: JPG, PNG, PDF. Max 5MB.</p>
                                </div>

                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                        <strong>Importante:</strong> Nuestro equipo revisara tus datos en un periodo de 24-48 hs habiles. Una vez aprobada tu cuenta, recibiras un mail de bienvenida y podras empezar a recibir clientes.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 flex gap-4">
                            {step > 1 && (
                                <Button variant="outline" className="flex-1 h-14 rounded-xl gap-2" onClick={prevStep}>
                                    <span className="material-symbols-outlined text-base">arrow_back</span> Anterior
                                </Button>
                            )}
                            <Button className="flex-1 h-14 rounded-2xl gap-2 shadow-md" onClick={step === 3 ? () => console.log("Finalizar") : nextStep}>
                                {step === 3 ? "Enviar datos" : "Siguiente"}
                                {step !== 3 && <span className="material-symbols-outlined text-base">arrow_forward</span>}
                            </Button>
                        </div>

                        <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
                            Preferis registrarte como cliente?{" "}
                            <Link href="/register" className="text-primary font-bold">Clic aca</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}