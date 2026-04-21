"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingVerificationPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">hourglass_top</span>
                </div>

                <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-white mb-4">
                    Verificación en proceso
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mb-8 max-w-md mx-auto">
                    Tu solicitud fue enviada correctamente. Nuestro equipo está revisando tus datos.
                    Este proceso puede demorar entre <strong>24 y 48 horas hábiles</strong>.
                </p>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 mb-8 text-left space-y-4">
                    <h3 className="font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 text-xl">info</span>
                        Mientras tanto podés:
                    </h3>
                    <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-orange-500 text-lg mt-0.5">check_circle</span>
                            Completar tu perfil con más información
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-orange-500 text-lg mt-0.5">check_circle</span>
                            Verificar tu email desde el link que te enviamos
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-orange-500 text-lg mt-0.5">check_circle</span>
                            Explorar la plataforma como cliente
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/perfil" className="flex-1">
                        <Button variant="outline" className="w-full h-14 rounded-xl">
                            Completar perfil
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button className="w-full h-14 rounded-xl">
                            Explorar plataforma
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}