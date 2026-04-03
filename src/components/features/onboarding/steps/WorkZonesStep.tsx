"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WorkConfig, WorkZoneData } from "@/hooks/useProviderOnboarding";
import type { WorkModality } from "@/types/api";

interface Props {
  data: WorkConfig;
  onNext: (data: WorkConfig) => void;
  onBack: () => void;
}

const modalityOptions: { value: WorkModality; label: string; icon: string; description: string }[] = [
  { value: "ON_SITE", label: "Presencial", icon: "location_on", description: "Vas al domicilio del cliente" },
  { value: "REMOTE", label: "Remoto", icon: "laptop", description: "Trabajás de forma virtual" },
  { value: "HYBRID", label: "Híbrido", icon: "sync_alt", description: "Ambas modalidades" },
];

export function WorkZonesStep({ data, onNext, onBack }: Props) {
  const [config, setConfig] = useState<WorkConfig>(data);
  const [newZone, setNewZone] = useState<WorkZoneData>({ city: "", neighborhood: "", postalCode: "" });

  const addZone = () => {
    if (!newZone.city.trim()) return;
    setConfig((prev) => ({ ...prev, zones: [...prev.zones, { ...newZone }] }));
    setNewZone({ city: "", neighborhood: "", postalCode: "" });
  };

  const removeZone = (idx: number) => {
    setConfig((prev) => ({ ...prev, zones: prev.zones.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
          Zona de trabajo
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Definí dónde y cómo ofrecés tus servicios
        </p>
      </div>

      {/* Work modality */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Modalidad de trabajo
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modalityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, workModality: opt.value }))}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                config.workModality === opt.value
                  ? "border-orange-300 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800"
                  : "border-slate-200 dark:border-zinc-700 hover:border-slate-300"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-2xl mb-2",
                  config.workModality === opt.value ? "text-orange-500" : "text-zinc-400"
                )}
              >
                {opt.icon}
              </span>
              <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{opt.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Work radius */}
      {config.workModality !== "REMOTE" && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Radio de trabajo: {config.workRadius} km
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={config.workRadius}
            onChange={(e) => setConfig((prev) => ({ ...prev, workRadius: Number(e.target.value) }))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>1 km</span>
            <span>100 km</span>
          </div>
        </div>
      )}

      {/* Zones */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Zonas específicas
        </label>

        {config.zones.map((zone, idx) => (
          <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
            <span className="material-symbols-outlined text-orange-500 text-lg">location_on</span>
            <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
              {zone.city}{zone.neighborhood ? `, ${zone.neighborhood}` : ""}
              {zone.postalCode ? ` (${zone.postalCode})` : ""}
            </span>
            <button type="button" onClick={() => removeZone(idx)} className="text-zinc-400 hover:text-red-500">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Ciudad *"
            value={newZone.city}
            onChange={(e) => setNewZone((prev) => ({ ...prev, city: e.target.value }))}
          />
          <Input
            placeholder="Barrio (opcional)"
            value={newZone.neighborhood}
            onChange={(e) => setNewZone((prev) => ({ ...prev, neighborhood: e.target.value }))}
          />
          <div className="flex gap-2">
            <Input
              placeholder="CP"
              value={newZone.postalCode}
              onChange={(e) => setNewZone((prev) => ({ ...prev, postalCode: e.target.value }))}
            />
            <Button type="button" variant="outline" onClick={addZone} className="shrink-0 px-3">
              <span className="material-symbols-outlined">add</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="button" onClick={() => onNext(config)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
