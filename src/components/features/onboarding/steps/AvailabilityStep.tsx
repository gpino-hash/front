"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AvailabilityBlock } from "@/hooks/useProviderOnboarding";
import type { DayOfWeek } from "@/types/api";

interface Props {
  data: AvailabilityBlock[];
  onNext: (data: AvailabilityBlock[]) => void;
  onBack: () => void;
}

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "MONDAY", label: "Lunes", short: "Lu" },
  { key: "TUESDAY", label: "Martes", short: "Ma" },
  { key: "WEDNESDAY", label: "Miércoles", short: "Mi" },
  { key: "THURSDAY", label: "Jueves", short: "Ju" },
  { key: "FRIDAY", label: "Viernes", short: "Vi" },
  { key: "SATURDAY", label: "Sábado", short: "Sá" },
  { key: "SUNDAY", label: "Domingo", short: "Do" },
];

const TIME_OPTIONS = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export function AvailabilityStep({ data, onNext, onBack }: Props) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(data);

  const toggleDay = (day: DayOfWeek) => {
    const exists = blocks.some((b) => b.dayOfWeek === day);
    if (exists) {
      setBlocks((prev) => prev.filter((b) => b.dayOfWeek !== day));
    } else {
      setBlocks((prev) => [...prev, { dayOfWeek: day, startTime: "09:00", endTime: "18:00" }]);
    }
  };

  const updateBlock = (day: DayOfWeek, field: "startTime" | "endTime", value: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.dayOfWeek === day ? { ...b, [field]: value } : b))
    );
  };

  const activeDays = new Set(blocks.map((b) => b.dayOfWeek));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
          Disponibilidad horaria
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Seleccioná los días y horarios en los que trabajás
        </p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.map(({ key, short }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleDay(key)}
            className={cn(
              "w-12 h-12 rounded-xl font-semibold text-sm transition-all",
              activeDays.has(key)
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-zinc-800 text-zinc-500 hover:bg-slate-200 dark:hover:bg-zinc-700"
            )}
          >
            {short}
          </button>
        ))}
      </div>

      {/* Time blocks */}
      {blocks.length > 0 && (
        <div className="space-y-3">
          {DAYS.filter(({ key }) => activeDays.has(key)).map(({ key, label }) => {
            const block = blocks.find((b) => b.dayOfWeek === key)!;
            return (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
              >
                <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 w-24">
                  {label}
                </span>
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={block.startTime}
                    onChange={(e) => updateBlock(key, "startTime", e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm flex-1"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="text-zinc-400 text-sm">a</span>
                  <select
                    value={block.endTime}
                    onChange={(e) => updateBlock(key, "endTime", e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm flex-1"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDay(key)}
                  className="text-zinc-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {blocks.length === 0 && (
        <div className="text-center py-8 text-zinc-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">calendar_month</span>
          <p className="text-sm">Seleccioná al menos un día para continuar</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="button" onClick={() => onNext(blocks)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
