"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Provider } from "@/types";
import { useServices } from "@/services/ServiceContext";

export interface HomeFilters {
    category: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    availableToday: boolean;
    verifiedOnly: boolean;
}

const defaultFilters: HomeFilters = {
    category: "All",
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
    availableToday: false,
    verifiedOnly: false,
};

export function useHomeFilters() {
    const { providerService } = useServices();
    const [allProviders, setAllProviders] = useState<Provider[]>([]);
    const [filters, setFilters] = useState<HomeFilters>(defaultFilters);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = () => setIsLoading(true);
        load();
        providerService.getAllProviders().then((data) => {
            if (!cancelled) {
                setAllProviders(data);
                setIsLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, [providerService]);

    const filteredProviders = useMemo(() => {
        return allProviders.filter((p) => {
            // Category filter
            if (filters.category !== "All") {
                const categoryMap: Record<string, string> = {
                    "Plumbing": "Plomería",
                    "Electrician": "Electricidad",
                    "Cleaning": "Limpieza",
                    "Painting": "Pintura",
                    "Moving": "Fletes y Mudanzas",
                    "Gardening": "Jardinería",
                    "HVAC": "Aire Acondicionado",
                };
                const mapped = categoryMap[filters.category] || filters.category;
                if (p.category !== mapped && p.category !== filters.category) return false;
            }

            // Price filter (pricePerHour is in cents)
            if (filters.minPrice > 0 && p.pricePerHour < filters.minPrice) return false;
            if (filters.maxPrice > 0 && p.pricePerHour > filters.maxPrice) return false;

            // Rating filter
            if (filters.minRating > 0 && p.rating < filters.minRating) return false;

            // Available today
            if (filters.availableToday) {
                const hasFullAvailability = p.availability.some(
                    (a) => a.hours.includes("24") || a.day.includes("Toda la semana")
                );
                if (!hasFullAvailability) return false;
            }

            // Verified only
            if (filters.verifiedOnly && !p.isVerified) return false;

            return true;
        });
    }, [allProviders, filters]);

    const setCategory = useCallback((category: string) => {
        setFilters((prev) => ({ ...prev, category }));
    }, []);

    const setMinPrice = useCallback((minPrice: number) => {
        setFilters((prev) => ({ ...prev, minPrice }));
    }, []);

    const setMaxPrice = useCallback((maxPrice: number) => {
        setFilters((prev) => ({ ...prev, maxPrice }));
    }, []);

    const setMinRating = useCallback((minRating: number) => {
        setFilters((prev) => ({ ...prev, minRating }));
    }, []);

    const toggleAvailableToday = useCallback(() => {
        setFilters((prev) => ({ ...prev, availableToday: !prev.availableToday }));
    }, []);

    const toggleVerifiedOnly = useCallback(() => {
        setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.category !== "All") count++;
        if (filters.minPrice > 0) count++;
        if (filters.maxPrice > 0) count++;
        if (filters.minRating > 0) count++;
        if (filters.availableToday) count++;
        if (filters.verifiedOnly) count++;
        return count;
    }, [filters]);

    return {
        filters,
        setCategory,
        setMinPrice,
        setMaxPrice,
        setMinRating,
        toggleAvailableToday,
        toggleVerifiedOnly,
        resetFilters,
        filteredProviders,
        isLoading,
        activeFilterCount,
    };
}
