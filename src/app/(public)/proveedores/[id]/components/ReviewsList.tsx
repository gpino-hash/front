"use client";

import { motion } from "framer-motion";
import type { Review } from "@/types";

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
}

export function ReviewsList({ reviews, averageRating }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-2 block">rate_review</span>
        <p className="text-sm text-zinc-500">Aún no hay reseñas para este proveedor</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
        <div className="text-center">
          <p className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-200">{averageRating.toFixed(1)}</p>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`material-symbols-outlined text-base ${
                  star <= Math.round(averageRating) ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                }`}
              >
                star
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-1">{reviews.length} reseñas</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review, i) => {
          const initials = review.userName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{review.userName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`material-symbols-outlined text-sm ${
                            star <= review.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      {new Date(review.date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
              {review.reply && (
                <div className="mt-3 ml-6 pl-4 border-l-2 border-orange-300 dark:border-orange-700">
                  <p className="text-xs font-medium text-zinc-500 mb-1">Respuesta del proveedor</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.reply}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}