"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/services/ServiceContext";
import type { ApiPublicCategory, ApiCatalogService, ApiPaginatedResponse } from "@/types/api";

export function useCatalog() {
  const { catalogService } = useServices();
  const [categories, setCategories] = useState<ApiPublicCategory[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ApiCatalogService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [cats, featured] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getFeaturedServices(),
        ]);
        setCategories(cats);
        setFeaturedServices(featured);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error cargando catálogo"));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [catalogService]);

  const getServicesByCategory = useCallback(
    async (slug: string, page = 1, limit = 10): Promise<ApiPaginatedResponse<ApiCatalogService>> => {
      return catalogService.getServicesByCategory(slug, { page, limit });
    },
    [catalogService]
  );

  const getCategoryBySlug = useCallback(
    async (slug: string) => {
      return catalogService.getCategoryBySlug(slug);
    },
    [catalogService]
  );

  return {
    categories,
    featuredServices,
    isLoading,
    error,
    getServicesByCategory,
    getCategoryBySlug,
  };
}
