"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background-light">
            <Header />

            <main className="pt-24 pb-20">
                <Container>
                    <div className="max-w-4xl mx-auto py-20">
                        <Badge variant="success" className="mb-6 h-8 px-4 text-xs bg-primary/10 text-primary ring-primary/20">NUESTRA HISTORIA</Badge>
                        <h1 className="text-4xl md:text-7xl font-extrabold text-zinc-800 mb-8 leading-tight">
                            Hacemos la vida m&aacute;s <span className="text-primary font-extrabold">f&aacute;cil</span> un servicio a la vez.
                        </h1>

                        <div className="aspect-video bg-zinc-200 rounded-2xl mb-16 overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary-dark/80 flex items-end p-12">
                                <p className="text-white text-2xl font-bold max-w-2xl leading-relaxed">
                                    "Nacimos con el objetivo de profesionalizar los servicios para el hogar en LATAM, brindando seguridad y transparencia."
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-extrabold text-zinc-800">Nuestra Misi&oacute;n</h2>
                                <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                    Conectar a las personas que necesitan ayuda con los profesionales m&aacute;s capacitados y confiables de su comunidad, fomentando el crecimiento econ&oacute;mico local y la tranquilidad de cada familia.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl font-extrabold text-zinc-800">Nuestro Equipo</h2>
                                <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                                    Somos un equipo de apasionados por la tecnolog&iacute;a y el impacto social, trabajando desde Buenos Aires para transformar la industria de los servicios en toda la regi&oacute;n.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Profesionales Activos", val: "+2.5k" },
                                { label: "Servicios Realizados", val: "+15k" },
                                { label: "Ciudades", val: "12" },
                                { label: "Rating Promedio", val: "4.8" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-4xl font-extrabold text-primary mb-2">{stat.val}</p>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
