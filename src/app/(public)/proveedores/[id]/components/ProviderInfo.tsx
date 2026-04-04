"use client";

import type { Provider } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProviderInfoProps {
  provider: Provider;
}

export function ProviderInfo({ provider }: ProviderInfoProps) {
  return (
    <div className="space-y-6">
      {/* Bio */}
      {provider.description && (
        <div>
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2">Sobre mí</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{provider.description}</p>
        </div>
      )}

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-3">
        {provider.pricePerHour > 0 && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Precio por hora</p>
            <p className="font-bold text-zinc-800 dark:text-zinc-200">{formatPrice(provider.pricePerHour)}</p>
          </div>
        )}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Categoría</p>
          <p className="font-bold text-zinc-800 dark:text-zinc-200">{provider.category || "General"}</p>
        </div>
      </div>

      {/* Work zones */}
      {provider.zones.length > 0 && (
        <div>
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-blue-500">location_on</span>
            Zonas de trabajo
          </h3>
          <div className="flex flex-wrap gap-2">
            {provider.zones.map((zone) => (
              <span
                key={zone}
                className="text-sm px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {provider.availability.length > 0 && (
        <div>
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-emerald-500">schedule</span>
            Disponibilidad
          </h3>
          <div className="space-y-2">
            {provider.availability.map((slot, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
              >
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{slot.day}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{slot.hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}