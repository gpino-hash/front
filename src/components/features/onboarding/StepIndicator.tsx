"use client";

import { cn } from "@/lib/utils";

const stepLabels = [
  "Datos personales",
  "Servicios",
  "Zona de trabajo",
  "Disponibilidad",
  "Documentos",
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, totalSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => onStepClick?.(i)}
              disabled={i > currentStep}
              className={cn(
                "flex items-center gap-2 group",
                i <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0",
                  i < currentStep
                    ? "bg-orange-500 text-white"
                    : i === currentStep
                      ? "bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950"
                      : "bg-slate-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                )}
              >
                {i < currentStep ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden lg:inline",
                  i <= currentStep
                    ? "text-zinc-800 dark:text-zinc-200"
                    : "text-zinc-400 dark:text-zinc-500"
                )}
              >
                {stepLabels[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3",
                  i < currentStep
                    ? "bg-orange-500"
                    : "bg-slate-200 dark:bg-zinc-700"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <span className="text-xs text-zinc-500">{stepLabels[currentStep]}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5">
          <div
            className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
