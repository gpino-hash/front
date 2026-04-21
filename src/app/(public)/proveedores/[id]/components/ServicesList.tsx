"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ServiceOffer } from "@/types";

interface ServicesListProps {
  services: ServiceOffer[];
}

export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-2 block">handyman</span>
        <p className="text-sm text-zinc-500">Este proveedor no tiene servicios publicados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((svc, i) => (
        <motion.div
          key={svc.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow"
        >
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">{svc.name}</h3>
          {svc.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">{svc.description}</p>
          )}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(svc.price)}
            </span>
            {svc.duration && (
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {svc.duration}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 w-full">
            <span className="material-symbols-outlined text-base">send</span>
            Solicitar
          </Button>
        </motion.div>
      ))}
    </div>
  );
}