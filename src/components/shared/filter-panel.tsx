"use client";

import type { HomeFilters } from "@/hooks/useHomeFilters";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
    filters: HomeFilters;
    onMinPriceChange: (value: number) => void;
    onMaxPriceChange: (value: number) => void;
    onMinRatingChange: (value: number) => void;
    onToggleAvailableToday: () => void;
    onToggleVerifiedOnly: () => void;
    onReset: () => void;
    className?: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

function ToggleSwitch({ checked, onChange, id }: ToggleSwitchProps) {
    return (
        <div className="relative flex items-center">
            <input
                id={id}
                className="peer sr-only"
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <div
                className={cn(
                    "w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 relative",
                    "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
                    "after:bg-white after:rounded-full after:h-4.5 after:w-4.5",
                    "after:shadow-sm after:transition-all after:duration-300",
                    checked
                        ? "bg-primary after:translate-x-[18px]"
                        : "bg-slate-200 after:translate-x-0"
                )}
            />
        </div>
    );
}

const ratingOptions = [
    { label: "4.5 o más", value: 4.5 },
    { label: "4.0 o más", value: 4.0 },
    { label: "Cualquier calificación", value: 0 },
];

function FilterPanel({
    filters,
    onMinPriceChange,
    onMaxPriceChange,
    onMinRatingChange,
    onToggleAvailableToday,
    onToggleVerifiedOnly,
    onReset,
    className,
}: FilterPanelProps) {
    return (
        <div className={cn(className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Filtros</h3>
                </div>
                <button
                    onClick={onReset}
                    className="text-xs text-slate-400 font-bold hover:text-primary transition-colors uppercase tracking-wide"
                >
                    Reiniciar
                </button>
            </div>

            <div className="p-6 space-y-7">
                {/* ── Price Range ── */}
                <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">
                        Rango de precio
                    </h4>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm font-medium pointer-events-none">$</span>
                            <input
                                id="filter-min-price"
                                className="w-full pl-7 pr-3 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-none
                                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-slate-300"
                                placeholder="Mín"
                                type="number"
                                value={filters.minPrice || ""}
                                onChange={(e) => onMinPriceChange(Number(e.target.value) || 0)}
                            />
                        </div>
                        <div className="w-3 h-px bg-slate-300 flex-shrink-0" />
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm font-medium pointer-events-none">$</span>
                            <input
                                id="filter-max-price"
                                className="w-full pl-7 pr-3 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-none
                                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-slate-300"
                                placeholder="Máx"
                                type="number"
                                value={filters.maxPrice || ""}
                                onChange={(e) => onMaxPriceChange(Number(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Rating ── */}
                <div className="border-t border-slate-100 pt-7">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">
                        Calificación mínima
                    </h4>
                    <div className="space-y-2">
                        {ratingOptions.map((opt) => {
                            const isSelected =
                                opt.value === 0
                                    ? filters.minRating === 0
                                    : filters.minRating === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => onMinRatingChange(opt.value)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2.5 rounded-none text-sm font-semibold transition-all duration-200 text-left",
                                        isSelected
                                            ? "bg-primary-subtle text-primary border border-primary/20"
                                            : "text-slate-600 hover:bg-slate-50 border border-transparent"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {opt.value > 0 && (
                                            <span className="material-symbols-outlined text-[14px] text-amber-400 fill-current">star</span>
                                        )}
                                        {opt.label}
                                    </span>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Toggle Options ── */}
                <div className="border-t border-slate-100 pt-7 space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">
                        Opciones
                    </h4>

                    <label htmlFor="toggle-available" className="flex items-center justify-between cursor-pointer group">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                Disponible hoy
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Solo mostrar disponibles ahora</p>
                        </div>
                        <ToggleSwitch
                            id="toggle-available"
                            checked={filters.availableToday}
                            onChange={onToggleAvailableToday}
                        />
                    </label>

                    <label htmlFor="toggle-verified" className="flex items-center justify-between cursor-pointer group">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                Sólo verificados
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Taskaonales con identidad verificada</p>
                        </div>
                        <ToggleSwitch
                            id="toggle-verified"
                            checked={filters.verifiedOnly}
                            onChange={onToggleVerifiedOnly}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

function FilterPanelSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("skeleton-linkedin relative overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAED]">
                <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-[#E2E5E9] rounded" />
                    <div className="h-4 w-16 bg-[#E2E5E9] rounded-sm" />
                </div>
                <div className="h-3 w-14 bg-[#E2E5E9] rounded-sm" />
            </div>

            <div className="p-6 space-y-7">
                {/* Price Range */}
                <div>
                    <div className="h-3 w-28 bg-[#E2E5E9] rounded-sm mb-4" />
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 bg-[#E2E5E9] rounded" />
                        <div className="w-3 h-px bg-[#E2E5E9]" />
                        <div className="flex-1 h-10 bg-[#E2E5E9] rounded" />
                    </div>
                </div>

                {/* Rating */}
                <div className="border-t border-[#E8EAED] pt-7">
                    <div className="h-3 w-32 bg-[#E2E5E9] rounded-sm mb-4" />
                    <div className="space-y-2">
                        <div className="h-10 w-full bg-[#E2E5E9] rounded" />
                        <div className="h-10 w-full bg-[#E2E5E9] rounded" />
                        <div className="h-10 w-full bg-[#E2E5E9] rounded" />
                    </div>
                </div>

                {/* Toggle Options */}
                <div className="border-t border-[#E8EAED] pt-7 space-y-5">
                    <div className="h-3 w-20 bg-[#E2E5E9] rounded-sm mb-4" />
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="space-y-1.5">
                                <div className="h-4 w-24 bg-[#E2E5E9] rounded-sm" />
                                <div className="h-3 w-40 bg-[#E2E5E9] rounded-sm" />
                            </div>
                            <div className="w-10 h-5.5 bg-[#E2E5E9] rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { FilterPanel, FilterPanelSkeleton };
