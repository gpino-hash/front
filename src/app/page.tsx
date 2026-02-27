"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProviderCard } from "@/components/shared/provider-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterPanel, FilterPanelSkeleton } from "@/components/shared/filter-panel";
import { MobileFilterDrawer, MobileFilterTrigger } from "@/components/shared/mobile-filter-drawer";
import { useHomeFilters } from "@/hooks/useHomeFilters";
import { HomeHero } from "@/components/features/home/HomeHero";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { categories } from "@/lib/mock-data/categories";

const categoryTabs = [
    { name: "Todos", icon: "home_repair_service" },
    ...[...categories]
        .sort((a, b) => b.providerCount - a.providerCount)
        .slice(0, 7)
        .map((cat) => ({ name: cat.name, icon: cat.icon })),
];

const recentlyViewed = [
    {
        id: "rv1",
        name: "Sparkle Home Cleaning",
        rating: 4.9,
        price: "From $35/hr",
        lastViewed: "Last viewed 2h ago",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB581kdqygKQdtL3oeUGyJ5OjsoVMeKmijiRwYC2xLJ8fkOzWoZkj0jAbOAVBoGu1AZSsXy75VMD6e6Z7yp0chEYFAvEtVv_i5XyAM0nLcAm6U1NGLdJMFtFIelvSKLhTs_JefPriOL2naGEfTy4CXvAPMxZbu72juR9JFK2uQyMk6M78jKEe4iTOhxjUsEKpqS5tZMiE0p7K9jXMACZ2G9dWiVDZpMkciSG0vNC-F_uKEUJV69j_Dap_SplSbk2SJcaiaML27QKPo",
    },
    {
        id: "rv2",
        name: "Rapid Electric 24/7",
        rating: 4.8,
        price: "From $50/visit",
        lastViewed: "Last viewed yesterday",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGGRqvx_-bbfvNM9R8ka5joqyvJrKanUuF4D8iIIuwMvwEP_GJd1XVZxGjUtcSj1MC2YTplWSIVL7lvxM_tIGsI8sfvLRtuIkspFE5aictlushmufnTvkGPp0wPyPSoGtuhkiOygQMtyKfY0oE4sx95o3hWS4jn_2aBeDxkyHfMcVZJmt0PjPSRjp1cQlJ7e5pZobAEgb2njjLFQkR7V3KqZOfFuOczX7fqVXRVqkqzbOiI4KwFy768Kzqkp0EPRY6Z6XuByli9So",
    },
];

export default function HomePage() {
    const {
        filters,
        setCategory,
        setMinPrice,
        setMaxPrice,
        setMinRating,
        toggleAvailableToday,
        toggleVerifiedOnly,
        resetFilters,
        filteredProviders,
        isLoading,
        activeFilterCount,
    } = useHomeFilters();

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background-light flex flex-col">
            <Header />

            <main className="en grow">
                <HomeHero />

                {/* Category Tabs Bar - Sticky */}
                <div className="sticky top-16 md:top-18 z-40 bg-white border-b border-slate-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Fade masks on left/right edges */}
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-6 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
                            <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-2 px-3 md:justify-center">
                                {categoryTabs.map((cat, idx) => (
                                    <motion.button
                                        key={cat.name}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                        onClick={() => setCategory(cat.name)}
                                        className={`flex flex-col items-center gap-1.5 min-w-15 group relative py-2 ${filters.category === cat.name
                                            ? "text-primary"
                                            : "text-slate-400 hover:text-slate-700"
                                            } transition-colors shrink-0`}
                                    >
                                        <span
                                            className={`material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform duration-200 ease-out ${filters.category === cat.name ? "text-primary" : ""
                                                }`}
                                            style={filters.category !== cat.name ? { fontVariationSettings: "'FILL' 0" } : undefined}
                                        >
                                            {cat.icon}
                                        </span>
                                        <span className={`text-[11px] whitespace-nowrap ${filters.category === cat.name ? "font-bold text-slate-900" : "font-medium"
                                            }`}>
                                            {cat.name}
                                        </span>
                                        {filters.category === cat.name && (
                                            <motion.span
                                                layoutId="activeCategory"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    {/* Recently Viewed Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <SectionHeader
                            title="Continuá donde lo dejaste"
                            subtitle="Servicios que viste recientemente"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recentlyViewed.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex gap-4 p-4 bg-white rounded-2xl border border-white shadow-soft hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                                >
                                    <div
                                        className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                                        style={{ backgroundImage: `url('${item.image}')` }}
                                    />
                                    <div className="flex flex-col justify-center flex-1">
                                        <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wide">{item.lastViewed}</div>
                                        <h3 className="font-bold text-slate-900 text-base line-clamp-1 leading-snug">{item.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className="flex items-center bg-slate-100 px-1.5 py-0.5 rounded text-xs font-bold text-slate-700">
                                                <span className="material-symbols-outlined text-yellow-500 text-[12px] mr-0.5 fill-current">star</span>
                                                {item.rating}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium ml-auto">{item.price}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Main Content: Filters + Grid */}
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar Filters (Desktop) */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <div className="sticky top-48">
                                {isLoading ? (
                                    <FilterPanelSkeleton />
                                ) : (
                                    <FilterPanel
                                        filters={filters}
                                        onMinPriceChange={setMinPrice}
                                        onMaxPriceChange={setMaxPrice}
                                        onMinRatingChange={setMinRating}
                                        onToggleAvailableToday={toggleAvailableToday}
                                        onToggleVerifiedOnly={toggleVerifiedOnly}
                                        onReset={resetFilters}
                                    />
                                )}
                            </div>
                        </aside>

                        {/* Professional Grid */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <SectionHeader
                                title="Profesionales mejor calificados en tu zona"
                                subtitle={`${filteredProviders.length} resultados`}
                                className="mb-8"
                            />

                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <motion.div
                                        key="loader"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                    >
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.08 }}
                                            >
                                                <SkeletonCard variant="provider" />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : filteredProviders.length > 0 ? (
                                    <motion.div
                                        key="grid"
                                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                    >
                                        {filteredProviders.map((p, idx) => (
                                            <motion.div
                                                key={p.id}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.07, duration: 0.35, ease: "easeOut" }}
                                            >
                                                <ProviderCard provider={p} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <EmptyState
                                            icon="search_off"
                                            title="No se encontraron profesionales"
                                            description="Intentá ajustar tus filtros o buscar en una categoría diferente."
                                            action={{ label: "Restablecer filtros", onClick: resetFilters }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Load More */}
                            {filteredProviders.length > 0 && (
                                <div className="mt-20 flex justify-center">
                                    <button className="flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-full shadow-soft hover:shadow-xl hover:border-primary/30 transition-all text-slate-900 font-bold transform hover:-translate-y-1 active:scale-95 group">
                                        Mostrar más profesionales
                                        <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Mobile Filter Trigger */}
            <MobileFilterTrigger
                activeFilterCount={activeFilterCount}
                onClick={() => setMobileFiltersOpen(true)}
            />

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
                isOpen={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                activeFilterCount={activeFilterCount}
            >
                <FilterPanel
                    filters={filters}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                    onMinRatingChange={setMinRating}
                    onToggleAvailableToday={toggleAvailableToday}
                    onToggleVerifiedOnly={toggleVerifiedOnly}
                    onReset={resetFilters}
                />
            </MobileFilterDrawer>

            <Footer />
        </div>
    );
}
