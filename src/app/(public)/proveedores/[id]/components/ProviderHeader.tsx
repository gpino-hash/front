"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/types";

interface ProviderHeaderProps {
  provider: Provider;
}

export function ProviderHeader({ provider }: ProviderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      {/* Avatar */}
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${provider.avatarColor} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
        {provider.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{provider.name}</h1>
          {provider.isVerified && (
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Verificado
            </span>
          )}
          {provider.isTopPro && (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
              Top Pro
            </span>
          )}
        </div>

        <p className="text-zinc-500 dark:text-zinc-400 mb-2">{provider.specialty}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`material-symbols-outlined text-lg ${
                    star <= Math.round(provider.rating)
                      ? "text-amber-400"
                      : "text-zinc-300 dark:text-zinc-700"
                  }`}
                >
                  star
                </span>
              ))}
            </div>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{provider.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({provider.reviewCount} reseñas)</span>
          </div>

          {/* Zones */}
          {provider.zones.length > 0 && (
            <span className="flex items-center gap-1 text-zinc-400">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {provider.zones.slice(0, 3).join(", ")}
            </span>
          )}
        </div>

        <div className="mt-4">
          <Link href="/dashboard/cliente/nueva-solicitud">
            <Button className="gap-2">
              <span className="material-symbols-outlined text-lg">send</span>
              Solicitar servicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}