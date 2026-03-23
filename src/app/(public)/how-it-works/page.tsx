"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function HowItWorksPage() {
    const [activeTab, setActiveTab] = useState("customers");

    return (
        <div className="min-h-screen bg-background-light">
            <Header />

            <main className="pt-24 pb-20">
                <section className="bg-primary-dark pt-20 pb-40 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]" />
                    <Container className="relative z-10">
                        <div className="max-w-3xl mx-auto">
                            <Badge variant="warning" className="mb-6 h-8 px-4 text-xs">GU&Iacute;A COMPLETA</Badge>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Tu camino al servicio <span className="text-blue-300 font-extrabold">perfecto</span></h1>
                            <p className="text-zinc-400 text-lg md:text-xl font-medium">Descubr&iacute; c&oacute;mo Taskao revoluciona la forma de contratar y ofrecer servicios profesionales en LATAM.</p>
                        </div>
                    </Container>
                </section>

                <Container className="-mt-20 relative z-20">
                    <Card className="rounded-xl p-2 overflow-hidden mb-24">
                        <Tabs
                            tabs={[
                                { id: "customers", label: "Para Clientes" },
                                { id: "providers", label: "Para Profesionales" },
                            ]}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                            className="justify-center border-none py-4"
                        />

                        <div className="p-8 md:p-16">
                            {activeTab === "customers" ? (
                                <div role="tabpanel" id="tabpanel-customers" aria-labelledby="tab-customers" className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center animate-fade-up">
                                    <div className="space-y-12">
                                        {[
                                            { icon: "search", title: "1. Busc\u00e1 y filtr\u00e1", desc: "Explor\u00e1 cientos de categor\u00edas. Us\u00e1 nuestros filtros de ubicaci\u00f3n, precio y rating para encontrar exactamente lo que necesit\u00e1s." },
                                            { icon: "work", title: "2. Compar\u00e1 perfiles", desc: "Revis\u00e1 las fotos de trabajos anteriores, le\u00e9 las rese\u00f1as de otros clientes y verific\u00e1 los precios antes de decidir." },
                                            { icon: "calendar_month", title: "3. Reserv\u00e1 tu fecha", desc: "Eleg\u00ed el d\u00eda y horario que mejor te convenga. Chate\u00e1 con el profesional para coordinar detalles espec\u00edficos." },
                                            { icon: "credit_card", title: "4. Pag\u00e1 con seguridad", desc: "El pago queda resguardado por Taskao. Solo se libera al profesional una vez que confirm\u00e1s que el trabajo termin\u00f3." }
                                        ].map((step, i) => (
                                            <div key={i} className="flex gap-6">
                                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-lg shadow-blue-500/5">
                                                    <span className="material-symbols-outlined">{step.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-zinc-800 mb-2">{step.title}</h3>
                                                    <p className="text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <div className="aspect-[4/5] bg-primary rounded-2xl rotate-3 shadow-2xl overflow-hidden">
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                                            {/* Placeholder content for illustration */}
                                            <div className="absolute inset-8 flex flex-col justify-end">
                                                <div className="bg-white/95 p-6 rounded-2xl shadow-xl">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 bg-amber-400 rounded-xl" />
                                                        <div className="space-y-2">
                                                            <div className="w-24 h-3 bg-zinc-200 rounded-full" />
                                                            <div className="w-16 h-2 bg-zinc-100 rounded-full" />
                                                        </div>
                                                    </div>
                                                    <div className="w-full h-8 bg-primary rounded-xl" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400 rounded-full blur-[80px] opacity-30" />
                                    </div>
                                </div>
                            ) : (
                                <div role="tabpanel" id="tabpanel-providers" aria-labelledby="tab-providers" className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center animate-fade-up">
                                    <div className="relative order-2 md:order-1">
                                        <div className="aspect-[4/5] bg-primary-dark rounded-2xl -rotate-3 shadow-2xl flex items-center justify-center text-8xl">
                                            &#128188;
                                        </div>
                                    </div>
                                    <div className="space-y-12 order-1 md:order-2">
                                        {[
                                            { icon: "person", title: "1. Cre\u00e1 tu perfil", desc: "Registrate, carg\u00e1 tus servicios y fotos de tus trabajos. Un perfil completo atrae 5 veces m\u00e1s clientes." },
                                            { icon: "verified_user", title: "2. Verific\u00e1 tu identidad", desc: "Carg\u00e1 tu documentaci\u00f3n para obtener el sello de 'Profesional Verificado' y generar mayor confianza." },
                                            { icon: "chat", title: "3. Recib\u00ed solicitudes", desc: "Te notificaremos cuando un cliente est\u00e9 interesado. Gestion\u00e1 todos tus turnos desde un solo lugar." },
                                            { icon: "credit_card", title: "4. Cobr\u00e1 sin vueltas", desc: "Recib\u00ed tus pagos directamente en tu cuenta bancaria. Taskao te garantiza el cobro de cada servicio realizado." }
                                        ].map((step, i) => (
                                            <div key={i} className="flex gap-6">
                                                <div className="w-14 h-14 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-800 shrink-0 shadow-lg">
                                                    <span className="material-symbols-outlined">{step.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-zinc-800 mb-2">{step.title}</h3>
                                                    <p className="text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* FAQ Section */}
                    <section className="py-24 max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 mb-4">Preguntas Frecuentes</h2>
                            <p className="text-zinc-500 font-medium">Todo lo que necesit&aacute;s saber sobre Taskao.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { q: "\u00bfEs seguro contratar por Taskao?", a: "S\u00ed, absolutamente. Verificamos la identidad de cada profesional y resguardamos tu pago hasta que el servicio es completado satisfactoriamente." },
                                { q: "\u00bfC\u00f3mo se realizan los pagos?", a: "Aceptamos todas las tarjetas de cr\u00e9dito, d\u00e9bito y transferencias. El dinero permanece seguro en nuestra plataforma hasta que el trabajo finaliza." },
                                { q: "\u00bfQu\u00e9 pasa si tengo un problema con el servicio?", a: "Nuestro equipo de soporte est\u00e1 disponible 24/7 para resolver cualquier inconveniente o disputa que pueda surgir." },
                                { q: "\u00bfTiene costo registrarse?", a: "No, el registro es totalmente gratuito tanto para clientes como para profesionales." }
                            ].map((faq, i) => (
                                <Card key={i} className="p-6 cursor-pointer hover:border-primary/30 transition-colors rounded-xl">
                                    <h4 className="font-bold text-zinc-800 flex justify-between items-center">
                                        {faq.q}
                                        <span className="material-symbols-outlined text-primary text-xl">chevron_right</span>
                                    </h4>
                                    <p className="mt-4 text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
