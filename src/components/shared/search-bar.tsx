"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface SearchBarProps {
    serviceQuery: string;
    locationQuery: string;
    onServiceChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onSearch?: () => void;
    variant?: "full" | "compact";
    className?: string;
}

function SearchBar({
    serviceQuery,
    locationQuery,
    onServiceChange,
    onLocationChange,
    onSearch,
    variant = "full",
    className,
}: SearchBarProps) {
    const [focused, setFocused] = useState<"service" | "location" | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.();
    };

    if (variant === "compact") {
        return (
            <form onSubmit={handleSubmit} role="search" className={cn("relative", className)}>
                <div className="flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-soft focus-within:border-primary/50 focus-within:shadow-glow transition-all">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-base">search</span>
                    <input
                        className="w-full bg-transparent border-none p-0 text-xs text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none font-bold"
                        placeholder="Buscar servicios..."
                        type="text"
                        value={serviceQuery}
                        onChange={(e) => onServiceChange(e.target.value)}
                    />
                </div>
            </form>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className={cn("flex flex-1 max-w-2xl mx-auto", className)}
        >
            <div
                className={cn(
                    "flex w-full items-center rounded-full px-1.5 py-1.5 transition-all duration-300",
                    "bg-white border",
                    focused
                        ? "border-primary/40 shadow-[0_0_0_3px_rgba(15,98,254,0.10),0_4px_20px_rgba(0,0,0,0.08)]"
                        : "border-slate-150 shadow-md hover:shadow-lg"
                )}
            >
                {/* Service Input */}
                <div
                    className={cn(
                        "flex-1 flex items-center px-4 border-r border-slate-100 py-1 rounded-l-full relative transition-colors",
                        focused === "service" ? "bg-primary-subtle/50" : "hover:bg-slate-50/60"
                    )}
                >
                    <span
                        className={cn(
                            "material-symbols-outlined mr-3 text-[20px] transition-colors",
                            focused === "service" ? "text-primary" : "text-slate-300"
                        )}
                        aria-hidden="true"
                    >
                        search
                    </span>
                    <div className="flex flex-col justify-center w-full">
                        <label
                            htmlFor="search-service"
                            className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em] mb-0"
                        >
                            Servicio
                        </label>
                        <input
                            id="search-service"
                            className="w-full bg-transparent border-none p-0 text-[13px] text-slate-950 placeholder-slate-300 focus:ring-0 focus:outline-none font-bold"
                            placeholder="¿Qué necesitás?"
                            type="text"
                            value={serviceQuery}
                            onChange={(e) => onServiceChange(e.target.value)}
                            onFocus={() => setFocused("service")}
                            onBlur={() => setFocused(null)}
                        />
                    </div>
                </div>

                {/* Location Input */}
                <div
                    className={cn(
                        "flex-1 flex items-center px-4 py-1 relative transition-colors",
                        focused === "location" ? "bg-primary-subtle/50" : "hover:bg-slate-50/60"
                    )}
                >
                    <span
                        className={cn(
                            "material-symbols-outlined mr-3 text-[20px] transition-colors",
                            focused === "location" ? "text-primary" : "text-slate-300"
                        )}
                        aria-hidden="true"
                    >
                        location_on
                    </span>
                    <div className="flex flex-col justify-center w-full">
                        <label
                            htmlFor="search-location"
                            className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em] mb-0"
                        >
                            Dónde
                        </label>
                        <input
                            id="search-location"
                            className="w-full bg-transparent border-none p-0 text-[13px] text-slate-950 placeholder-slate-300 focus:ring-0 focus:outline-none font-bold"
                            placeholder="Tu ciudad"
                            type="text"
                            value={locationQuery}
                            onChange={(e) => onLocationChange(e.target.value)}
                            onFocus={() => setFocused("location")}
                            onBlur={() => setFocused(null)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    aria-label="Buscar"
                    className="bg-primary hover:bg-primary-dark text-white rounded-full p-3 ml-1.5 mr-0
                               shadow-[0_4px_16px_rgba(15,98,254,0.35)] hover:shadow-[0_6px_20px_rgba(15,98,254,0.45)]
                               transition-all duration-200 transform active:scale-90 flex items-center justify-center aspect-square"
                >
                    <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
            </div>
        </form>
    );
}

export { SearchBar };
