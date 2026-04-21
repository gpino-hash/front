"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ApiPublicCategory } from "@/types/api";

interface CategoryCardProps {
  category: ApiPublicCategory;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/servicios/${category.slug}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
            <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
              {category.icon ?? "category"}
            </span>
          </div>
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">person</span>
              {category.providerCount} proveedores
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">handyman</span>
              {category.servicesCount} servicios
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}