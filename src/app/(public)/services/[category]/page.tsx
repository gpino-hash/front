"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { ProviderCard } from "@/components/shared/provider-card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmptyState } from "@/components/ui/empty-state";
import { useCategoryDetails } from "@/hooks/useCategoryDetails";
import Link from "next/link";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: slug } = use(params);
    const { category, providers, isLoading, error } = useCategoryDetails(slug);

    if (error) {
        return (
            <div className="min-h-screen bg-background-light">
                <Header />
                <main className="pt-24 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl font-bold text-red-500 mb-2">Ocurrió un error</p>
                        <p className="text-zinc-500">{error.message}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light">
                <Header />
                <main className="pt-24 pb-20 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-background-light">
                <Header />
                <main className="pt-24 pb-20 text-center">
                    <p className="text-xl font-bold text-zinc-500">Categoría no encontrada</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 pb-20">
                <Container>
                    {/* Breadcrumbs */}
                    <Breadcrumbs
                        items={[
                            { label: "Inicio", href: "/" },
                            { label: "Servicios", href: "/services" },
                            { label: category.name },
                        ]}
                        className="mb-10 pt-8"
                    />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-950 mb-4 tracking-tight">{category.name}</h1>
                            <p className="text-slate-500 text-lg font-medium">Encontrá los mejores profesionales verificados en {category.name}.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <Button variant="outline" className="flex-1 md:flex-none h-14 rounded-xl gap-3 font-bold border-slate-200 hover:bg-slate-50 text-slate-700 px-8">
                                <span className="material-symbols-outlined text-[18px]">tune</span> Filtros
                            </Button>
                            <Button className="flex-1 md:flex-none h-14 rounded-xl gap-3 font-bold shadow-md px-8 bg-primary hover:bg-primary-dark">
                                <span className="material-symbols-outlined text-[18px]">map</span> Ver mapa
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar Filters (Desktop) */}
                        <aside className="hidden lg:block w-72 shrink-0 space-y-12">
                            <div>
                                <h4 className="font-bold text-slate-950 mb-6 flex items-center gap-3 text-lg">
                                    <span className="material-symbols-outlined text-primary text-[20px] fill-current">star</span> Valoración
                                </h4>
                                <div className="space-y-4">
                                    {[5, 4, 3].map(val => (
                                        <label key={val} className="flex items-center gap-4 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input type="checkbox" className="peer sr-only" />
                                                <div className="w-6 h-6 rounded-xl border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary transition-all duration-300" />
                                                <span className="material-symbols-outlined absolute text-white text-[14px] scale-0 peer-checked:scale-100 transition-transform duration-300">check</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{val} estrellas o más</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-950 mb-6 text-lg">Precio por hora</h4>
                                <div className="space-y-6">
                                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2/3 h-full bg-primary" />
                                    </div>
                                    <input
                                        type="range"
                                        className="w-full h-2 bg-transparent appearance-none cursor-pointer accent-primary -mt-8 relative z-10"
                                        min="2000" max="30000"
                                    />
                                    <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">$2.000</span>
                                        <span className="bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">$30.000</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-950 mb-6 text-lg">Disponibilidad</h4>
                                <div className="space-y-4">
                                    {["Hoy", "Esta semana", "Fines de semana"].map(label => (
                                        <label key={label} className="flex items-center gap-4 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input type="checkbox" className="peer sr-only" />
                                                <div className="w-6 h-6 rounded-xl border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary transition-all duration-300" />
                                                <span className="material-symbols-outlined absolute text-white text-[14px] scale-0 peer-checked:scale-100 transition-transform duration-300">check</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Results Grid */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{providers.length} profesionales encontrados</p>
                                <select className="text-sm font-bold text-slate-900 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors">
                                    <option>Ordenar por: Relevancia</option>
                                    <option>Precio: Menor a Mayor</option>
                                    <option>Mejor valorados</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {providers.map(p => (
                                    <ProviderCard key={p.id} provider={p} />
                                ))}
                            </div>

                            {providers.length === 0 && (
                                <EmptyState
                                    icon="local_shipping"
                                    title="Próximamente en tu zona"
                                    description="Estamos sumando nuevos profesionales verificados en esta categoría para brindarte el mejor servicio."
                                    action={{ label: "Ver otras categorías", href: "/services" }}
                                />
                            )}
                        </div>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
