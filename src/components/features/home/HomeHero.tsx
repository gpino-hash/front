"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/shared/search-bar";
import { Container } from "@/components/layout/container";
import { useState } from "react";
import { categories } from "@/lib/mock-data/categories";

const trustStats = [
    { value: "50K+", label: "Profesionales" },
    { value: "4.9★", label: "Calificación media" },
    { value: "2M+", label: "Trabajos completados" },
];

const quickTags = [...categories]
    .sort((a, b) => b.providerCount - a.providerCount)
    .map((c) => c.name);

export function HomeHero() {
    const [serviceQuery, setServiceQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    return (
        <section className="relative pt-28 pb-28 lg:pt-44 lg:pb-40 overflow-hidden bg-slate-950">
            {/* ── Animated gradient background ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Primary orb - top left */}
                <div className="absolute -top-[15%] -left-[5%] w-[55%] h-[65%] bg-primary/25 rounded-full blur-[130px] animate-gradient" />
                {/* Accent orb - bottom right */}
                <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[60%] bg-violet-600/15 rounded-full blur-[150px] animate-gradient" style={{ animationDelay: "2s" }} />
                {/* Subtle center glow */}
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-blue-500/08 rounded-full blur-[100px]" />

                {/* Fine dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                {/* Diagonal lines overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 40px)",
                    }}
                />
            </div>

            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* ── Trust badge ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-dark border border-white/10 mb-10"
                    >
                        <span className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-yellow-400 text-[13px] fill-current">star</span>
                            ))}
                        </span>
                        <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.18em]">
                            +50.000 profesionales verificados
                        </span>
                    </motion.div>

                    {/* ── Headline ── */}
                    <motion.h1
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-6 leading-[0.92] tracking-[-0.03em]"
                    >
                        El experto correcto,{" "}
                        <br className="hidden sm:block" />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-violet-400 animate-gradient">
                                en tiempo récord.
                            </span>
                        </span>
                    </motion.h1>

                    {/* ── Subtitle ── */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Encontrá profesionales confiables para cualquier tarea del hogar.
                        Calidad garantizada y disponibilidad inmediata en tu zona.
                    </motion.p>

                    {/* ── Search Box ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative max-w-3xl mx-auto"
                    >
                        {/* Glow ring behind search */}
                        <div className="absolute -inset-1 rounded-[2.75rem] bg-gradient-to-r from-primary/30 via-violet-500/20 to-primary/30 blur-lg opacity-60 pointer-events-none" />

                        <div id="hero-search" className="relative glass-dark rounded-[2.5rem] p-2 border border-white/10 shadow-2xl">
                            <SearchBar
                                serviceQuery={serviceQuery}
                                locationQuery={locationQuery}
                                onServiceChange={setServiceQuery}
                                onLocationChange={setLocationQuery}
                                className="!max-w-none shadow-none border-none bg-transparent"
                            />
                        </div>

                        {/* Quick search tags */}
                        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar">
                            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mr-1 flex-shrink-0">
                                Popular:
                            </span>
                            {quickTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setServiceQuery(tag)}
                                    className="text-xs font-semibold text-slate-400 px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Trust stats ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex items-center justify-center gap-0 mt-14 divide-x divide-white/10"
                    >
                        {trustStats.map((stat) => (
                            <div key={stat.label} className="px-8 text-center">
                                <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </Container>

            {/* Transition fade to next section */}
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background-light to-transparent pointer-events-none" />
        </section>
    );
}
