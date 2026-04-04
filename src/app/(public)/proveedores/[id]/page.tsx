"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useServices } from "@/services/ServiceContext";
import { cn } from "@/lib/utils";
import { ProviderHeader } from "./components/ProviderHeader";
import { ServicesList } from "./components/ServicesList";
import { ReviewsList } from "./components/ReviewsList";
import { ProviderInfo } from "./components/ProviderInfo";
import type { Provider, Review } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const tabs = [
  { key: "servicios", label: "Servicios", icon: "handyman" },
  { key: "resenas", label: "Reseñas", icon: "rate_review" },
  { key: "info", label: "Información", icon: "info" },
] as const;

export default function ProviderProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { providerService, reviewService } = useServices();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("servicios");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [prov, revs] = await Promise.all([
          providerService.getProviderById(id),
          reviewService.getReviewsByProviderId(id),
        ]);
        setProvider(prov ?? null);
        setReviews(revs);
      } catch {
        setProvider(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, providerService, reviewService]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-zinc-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-40 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">person_off</span>
        <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">Proveedor no encontrado</h2>
        <p className="text-zinc-500 mb-6">El perfil que buscás no existe o fue dado de baja.</p>
        <Link href="/servicios" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Explorar servicios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Inicio</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/servicios" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Proveedores</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">{provider.name}</span>
      </nav>

      {/* Header */}
      <ProviderHeader provider={provider} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.key
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "servicios" && <ServicesList services={provider.services} />}
        {activeTab === "resenas" && <ReviewsList reviews={reviews} averageRating={provider.rating} />}
        {activeTab === "info" && <ProviderInfo provider={provider} />}
      </div>
    </div>
  );
}