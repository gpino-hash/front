"use client";

import { useState, useEffect } from "react";
import { Provider, Review } from "@/types";
import { useServices } from "@/services/ServiceContext";

export function useProviderProfile(id: string) {
    const { providerService, reviewService } = useServices();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeTab, setActiveTab] = useState("services");

    useEffect(() => {
        const fetchProviderData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [p, r] = await Promise.all([
                    providerService.getProviderById(id),
                    reviewService.getReviewsByProviderId(id)
                ]);
                setProvider(p || null);
                setReviews(r);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Error fetching provider details"));
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProviderData();
        }
    }, [id, providerService, reviewService]);

    return {
        provider,
        reviews,
        isLoading,
        error,
        activeTab,
        setActiveTab
    };
}
