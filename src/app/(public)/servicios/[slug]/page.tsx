"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useCatalog } from "@/hooks/useCatalog";
import { ServiceCard } from "../components/ServiceCard";
import type { ApiPublicCategory, ApiCatalogService } from "@/types/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { getCategoryBySlug, getServicesByCategory } = useCatalog();
  const [category, setCategory] = useState<ApiPublicCategory | null>(null);
  const [services, setServices] = useState<ApiCatalogService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const cat = await getCategoryBySlug(slug);
        if (!cat) {
          setError(true);
          return;
        }
        setCategory(cat);

        const result = await getServicesByCategory(slug);
        setServices(result.data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [slug, getCategoryBySlug, getServicesByCategory]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-6 w-64 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-10 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">
          search_off
        </span>
        <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          Categoría no encontrada
        </h2>
        <p className="text-zinc-500 mb-6">La categoría que buscás no existe o fue eliminada.</p>
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          Inicio
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/servicios" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          Servicios
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            {category.icon ?? "category"}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100">{category.name}</h1>
          {category.description && (
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">{category.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">person</span>
              {category.providerCount} proveedores
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">handyman</span>
              {category.servicesCount} servicios
            </span>
          </div>
        </div>
      </div>

      {/* Sub-categories (children) */}
      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {category.children.map((child) => (
            <span
              key={child.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400"
            >
              <span className="material-symbols-outlined text-[16px]">{child.icon ?? "label"}</span>
              {child.name}
            </span>
          ))}
        </div>
      )}

      {/* Services grid */}
      <section>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
          Servicios disponibles
        </h2>
        {services.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-2 block">
              inventory_2
            </span>
            <p className="text-zinc-500">No hay servicios disponibles en esta categoría aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}