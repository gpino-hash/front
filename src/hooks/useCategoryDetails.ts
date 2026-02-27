"use client";

import { useState, useEffect } from "react";
import { Category, Provider } from "@/types";
import { useServices } from "@/services/ServiceContext";

export function useCategoryDetails(slug: string) {
    const { categoryService, providerService } = useServices();
    const [category, setCategory] = useState<Category | null>(null);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [cat, allProviders] = await Promise.all([
                    categoryService.getCategoryBySlug(slug),
                    providerService.getAllProviders()
                ]);

                if (cat) {
                    setCategory(cat);
                    const filtered = allProviders.filter(
                        p => p.category.toLowerCase() === cat.name.toLowerCase()
                    );
                    setProviders(filtered);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Error fetching category details"));
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchDetails();
        }
    }, [slug, categoryService, providerService]);

    return {
        category,
        providers,
        isLoading,
        error
    };
}
