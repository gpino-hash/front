"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import type { ApiCatalogService } from "@/types/api";

interface ServiceCardProps {
  service: ApiCatalogService;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const priceDisplay = service.minPrice && service.maxPrice
    ? `${formatPrice(service.minPrice)} - ${formatPrice(service.maxPrice)}`
    : formatPrice(service.suggestedPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow"
    >
      <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">{service.name}</h3>
      {service.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
          {service.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{priceDisplay}</span>
        {service.priceUnitLabel && (
          <span className="text-[11px] text-zinc-400">· {service.priceUnitLabel}</span>
        )}
        {service.formattedDuration && (
          <span className="text-[11px] text-zinc-400">· {service.formattedDuration}</span>
        )}
      </div>

      {service.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/servicios/${service.category?.slug ?? ""}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Ver proveedores
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </Link>
    </motion.div>
  );
}