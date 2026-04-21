"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalog } from "@/hooks/useCatalog";
import { cn } from "@/lib/utils";
import type { ServiceSelection } from "@/hooks/useProviderOnboarding";
import type { ApiPublicCategory } from "@/types/api";

interface Props {
  data: ServiceSelection[];
  onNext: (data: ServiceSelection[]) => void;
  onBack: () => void;
}

export function ServicesSelectionStep({ data, onNext, onBack }: Props) {
  const { categories, isLoading } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<ApiPublicCategory | null>(null);
  const [services, setServices] = useState<ServiceSelection[]>(data);

  // Auto-select first category (derived state; no need for an effect)
  const activeCategory = selectedCategory ?? categories[0] ?? null;

  const addService = (name: string, serviceId?: string) => {
    if (services.some((s) => s.name === name)) return;
    setServices((prev) => [
      ...prev,
      { serviceId, name, description: "", price: 0, priceUnit: "FIXED", estimatedDuration: 60 },
    ]);
  };

  const removeService = (name: string) => {
    setServices((prev) => prev.filter((s) => s.name !== name));
  };

  const updateService = (index: number, field: keyof ServiceSelection, value: string | number) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleNext = () => {
    if (services.length === 0) return;
    onNext(services);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
          Servicios que ofrecés
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Elegí los servicios de nuestro catálogo o agregá los tuyos
        </p>
      </div>

      {/* Category selection */}
      {isLoading ? (
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-28 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                activeCategory?.id === cat.id
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
              )}
            >
              <span className="material-symbols-outlined text-[16px] mr-1 align-middle">
                {cat.icon ?? "category"}
              </span>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Sub-services from category */}
      {activeCategory && activeCategory.children.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeCategory.children.map((child) => {
            const isSelected = services.some((s) => s.name === child.name);
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => (isSelected ? removeService(child.name) : addService(child.name, child.id))}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all",
                  isSelected
                    ? "border-orange-300 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800"
                    : "border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-lg",
                    isSelected ? "text-orange-500" : "text-zinc-400"
                  )}
                >
                  {isSelected ? "check_circle" : "add_circle_outline"}
                </span>
                <span className={isSelected ? "text-orange-700 dark:text-orange-300 font-medium" : "text-zinc-700 dark:text-zinc-300"}>
                  {child.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected services with pricing */}
      {services.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Servicios seleccionados ({services.length})
          </h3>
          {services.map((svc, idx) => (
            <div key={svc.name} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{svc.name}</span>
                <button
                  type="button"
                  onClick={() => removeService(svc.name)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Precio (ARS)"
                  type="number"
                  placeholder="0"
                  value={svc.price || ""}
                  onChange={(e) => updateService(idx, "price", Number(e.target.value))}
                />
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Tipo de precio
                  </label>
                  <select
                    value={svc.priceUnit}
                    onChange={(e) => updateService(idx, "priceUnit", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="FIXED">Precio fijo</option>
                    <option value="HOURLY">Por hora</option>
                    <option value="QUOTE">A cotizar</option>
                    <option value="PER_METER">Por metro</option>
                    <option value="PER_UNIT">Por unidad</option>
                  </select>
                </div>
                <Input
                  label="Duración (min)"
                  type="number"
                  placeholder="60"
                  value={svc.estimatedDuration || ""}
                  onChange={(e) => updateService(idx, "estimatedDuration", Number(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="button" onClick={handleNext} disabled={services.length === 0}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
