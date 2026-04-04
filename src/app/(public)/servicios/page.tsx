"use client";

import { useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { CategoryCard } from "./components/CategoryCard";
import { ServiceCard } from "./components/ServiceCard";

export default function ServiciosCatalogPage() {
  const { categories, featuredServices, isLoading, error } = useCatalog();
  const [search, setSearch] = useState("");

  const filteredCategories = search.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.description ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  if (error) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">error</span>
        <p className="text-zinc-600 dark:text-zinc-400">Error cargando el catálogo</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-zinc-950 text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">
            Encontrá el profesional que necesitás
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Explorá nuestras categorías de servicios y conectá con proveedores verificados
          </p>
          <div className="max-w-xl mx-auto relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="¿Qué servicio necesitás?"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">category</span>
            <h2 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Categorías</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-2 block">search_off</span>
              <p className="text-zinc-500">No se encontraron categorías para &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Featured services */}
        {featuredServices.length > 0 && !search.trim() && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-2xl text-amber-500">star</span>
              <h2 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">
                Servicios destacados
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredServices.map((svc, i) => (
                <ServiceCard key={svc.id} service={svc} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}