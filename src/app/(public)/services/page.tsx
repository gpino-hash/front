"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { useServicesCatalog } from "@/hooks/useServicesCatalog";
import { Category } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ServicesPage() {
    const {
        categories,
        popularCategories,
        searchQuery,
        setSearchQuery,
        isLoading,
        error,
        activeCategory,
        setActiveCategory,
        activeCategoryData,
    } = useServicesCatalog();

    if (error) {
        return (
            <div className="min-h-screen bg-background-light">
                <Header />
                <main className="pt-44 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl font-bold text-red-500 mb-2">Ocurrio un error</p>
                        <p className="text-zinc-500">{error.message}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-36 pb-12 lg:pt-44 lg:pb-16 bg-white border-b border-border-light">
                    <Container>
                        <Breadcrumbs
                            items={[
                                { label: "Inicio", href: "/" },
                                { label: "Servicios" },
                            ]}
                            className="mb-8"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                Directorio de Servicios
                            </h1>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                                Explorá todas las categorías y encontrá al profesional ideal para tu proyecto. Más de 2.500 expertos verificados.
                            </p>
                        </motion.div>

                        {/* Search Bar + Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-8 max-w-2xl"
                        >
                            <div className="relative bg-white p-1.5 rounded-2xl shadow-card flex items-center border border-border-light">
                                <div className="flex-1 flex items-center">
                                    <span className="material-symbols-outlined ml-4 text-slate-400 text-[22px]">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar servicios o categorías..."
                                        className="w-full h-12 px-4 bg-transparent border-none focus:ring-0 text-slate-900 font-bold text-base placeholder:text-slate-400 placeholder:font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className="hidden md:flex items-center gap-2 h-12 px-6 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95">
                                    <span className="material-symbols-outlined text-[18px]">tune</span>
                                    <span>Filtros avanzados</span>
                                </button>
                            </div>
                        </motion.div>
                    </Container>
                </section>

                {/* Popular Categories */}
                <section className="py-12 bg-white border-b border-border-light">
                    <Container>
                        <SectionHeader
                            title="Categorías populares"
                            subtitle="Las más buscadas por nuestros usuarios"
                        />

                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="skeleton-linkedin flex flex-col items-center p-6 bg-white border border-[#E8EAED] rounded-2xl overflow-hidden">
                                        <div className="w-14 h-14 bg-[#E2E5E9] rounded-full mb-3" />
                                        <div className="h-4 bg-[#E2E5E9] rounded w-20 mb-1.5" />
                                        <div className="h-3 bg-[#E2E5E9] rounded w-14" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {popularCategories.map((cat, idx) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            href={`/services/${cat.slug}`}
                                            className="flex flex-col items-center p-6 rounded-2xl border border-border-light bg-white hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                            </div>
                                            <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors text-center">
                                                {cat.name}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                {cat.providerCount} expertos
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Container>
                </section>

                {/* Main Layout: Sidebar + Content */}
                <section className="py-12 lg:py-16">
                    <Container>
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar */}
                            <Sidebar
                                categories={categories}
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                                isLoading={isLoading}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {isLoading ? (
                                    <LoadingSkeleton />
                                ) : categories.length === 0 ? (
                                    <EmptyState
                                        icon="search"
                                        title="No encontramos lo que buscás"
                                        description="Probá con otras palabras clave o explorá nuestras categorías recomendadas."
                                        action={{ label: "Ver todo el catálogo", onClick: () => setSearchQuery("") }}
                                    />
                                ) : (
                                    <>
                                        {/* Recommended Section */}
                                        <RecommendedSection categories={categories} />

                                        {/* Active Category Sub-services */}
                                        <ActiveCategorySection activeCategoryData={activeCategoryData} />

                                        {/* All Categories Sub-services (when no active) */}
                                        {!activeCategoryData && (
                                            <AllCategoriesGrid categories={categories} />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Container>
                </section>
            </main>

            <Footer />
        </div>
    );
}

/* ========================= */
/* Sidebar Component          */
/* ========================= */

function Sidebar({
    categories,
    activeCategory,
    setActiveCategory,
    isLoading,
    searchQuery,
    setSearchQuery,
}: {
    categories: Category[];
    activeCategory: string | null;
    setActiveCategory: (id: string | null) => void;
    isLoading: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}) {
    return (
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-32">
                <div className="bg-white rounded-2xl border border-border-light p-5">
                    <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
                        Explorar Directorio
                    </h3>

                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="skeleton-linkedin h-9 bg-[#E2E5E9] rounded-xl overflow-hidden" />
                            ))}
                        </div>
                    ) : (
                        <nav className="space-y-1">
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <div key={cat.id}>
                                        <button
                                            onClick={() => setActiveCategory(isActive ? null : cat.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-sm font-bold ${
                                                isActive
                                                    ? "bg-primary/5 text-primary"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                                <span>{cat.name}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-[11px] font-medium text-slate-400">{cat.providerCount}</span>
                                                <span className={`material-symbols-outlined text-[16px] transition-transform ${isActive ? "rotate-180" : ""}`}>
                                                    expand_more
                                                </span>
                                            </span>
                                        </button>

                                        <AnimatePresence>
                                            {isActive && cat.subServices && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-9 py-1 space-y-0.5">
                                                        {cat.subServices.map((sub) => (
                                                            <Link
                                                                key={sub.name}
                                                                href={`/services/${cat.slug}`}
                                                                className="block px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </nav>
                    )}
                </div>
            </div>
        </aside>
    );
}

/* ========================= */
/* Recommended Section        */
/* ========================= */

function RecommendedSection({ categories }: { categories: Category[] }) {
    // Pick 2 categories with most providers as "recommended"
    const recommended = [...categories]
        .sort((a, b) => b.providerCount - a.providerCount)
        .slice(0, 2);

    const images = [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    ];

    return (
        <div className="mb-10">
            <SectionHeader
                title="Recomendados para vos"
                subtitle="Categorías destacadas según tu zona"
                accent
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommended.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={`/services/${cat.slug}`} className="group block">
                            <div className="bg-white rounded-2xl border border-border-light overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                                {/* Image */}
                                <div className="relative h-44 bg-slate-100 overflow-hidden">
                                    <img
                                        src={images[idx]}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-900 shadow-sm">
                                            <span className="material-symbols-outlined text-primary text-[14px]">{cat.icon}</span>
                                            {cat.name}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-400/90 backdrop-blur-sm text-xs font-bold text-amber-900">
                                            <span className="material-symbols-outlined text-[14px]">star</span>
                                            4.8
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-extrabold text-lg text-slate-900 mb-1.5 group-hover:text-primary transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {cat.description} {cat.providerCount} profesionales disponibles.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ========================= */
/* Active Category Section    */
/* ========================= */

function ActiveCategorySection({ activeCategoryData }: { activeCategoryData: Category | null }) {
    if (!activeCategoryData || !activeCategoryData.subServices) return null;

    return (
        <motion.div
            key={activeCategoryData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
        >
            <SectionHeader
                title={`Servicios de ${activeCategoryData.name}`}
                subtitle={`${activeCategoryData.subServices.length} sub-servicios disponibles`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCategoryData.subServices.map((sub, idx) => (
                    <motion.div
                        key={sub.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border-light hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                            <span className="material-symbols-outlined text-[22px]">{sub.icon}</span>
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                {sub.name}
                            </h4>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                {sub.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ========================= */
/* All Categories Grid        */
/* ========================= */

function AllCategoriesGrid({ categories }: { categories: Category[] }) {
    return (
        <div>
            <SectionHeader
                title="Todas las categorías"
                subtitle={`${categories.length} categorías disponibles`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                    >
                        <Link
                            href={`/services/${cat.slug}`}
                            className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border-light hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
                                        {cat.name}
                                    </h4>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        {cat.providerCount} expertos
                                    </span>
                                </div>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                    {cat.description}
                                </p>
                                {cat.subServices && (
                                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                                        {cat.subServices.slice(0, 3).map((sub) => (
                                            <span
                                                key={sub.name}
                                                className="inline-flex px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] font-medium text-slate-500"
                                            >
                                                {sub.name}
                                            </span>
                                        ))}
                                        {cat.subServices.length > 3 && (
                                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-primary/5 text-[11px] font-bold text-primary">
                                                +{cat.subServices.length - 3} más
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-10">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-border-light rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Cargar más servicios
                </button>
            </div>
        </div>
    );
}

/* ========================= */
/* Loading Skeleton           */
/* ========================= */

function LoadingSkeleton() {
    return (
        <div>
            {/* Recommended skeleton */}
            <div className="mb-10">
                <div className="skeleton-linkedin h-8 bg-[#E2E5E9] rounded w-56 mb-2 overflow-hidden" />
                <div className="skeleton-linkedin h-4 bg-[#E2E5E9] rounded w-72 mb-6 overflow-hidden" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="skeleton-linkedin bg-white rounded-2xl border border-[#E8EAED] overflow-hidden">
                            <div className="h-44 bg-[#E2E5E9]" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 bg-[#E2E5E9] rounded w-3/4" />
                                <div className="h-4 bg-[#E2E5E9] rounded w-full" />
                                <div className="h-4 bg-[#E2E5E9] rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid skeleton */}
            <div className="skeleton-linkedin h-8 bg-[#E2E5E9] rounded w-48 mb-2 overflow-hidden" />
            <div className="skeleton-linkedin h-4 bg-[#E2E5E9] rounded w-64 mb-6 overflow-hidden" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-linkedin flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E8EAED] overflow-hidden">
                        <div className="w-12 h-12 bg-[#E2E5E9] rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#E2E5E9] rounded w-3/4" />
                            <div className="h-3 bg-[#E2E5E9] rounded w-full" />
                            <div className="flex gap-1.5 mt-2">
                                <div className="h-6 bg-[#E2E5E9] rounded-lg w-20" />
                                <div className="h-6 bg-[#E2E5E9] rounded-lg w-24" />
                                <div className="h-6 bg-[#E2E5E9] rounded-lg w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
