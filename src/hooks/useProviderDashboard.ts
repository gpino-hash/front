"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/services/ServiceContext";
import { useAuth } from "@/hooks/useAuth";
import type { ApiProvider, ApiProviderService, ApiServiceRequest } from "@/types/api";

export function useProviderDashboard() {
  const { providerManagementService, providerServiceService, serviceRequestService } = useServices();
  const { user } = useAuth();

  const [provider, setProvider] = useState<ApiProvider | null>(null);
  const [services, setServices] = useState<ApiProviderService[]>([]);
  const [openRequests, setOpenRequests] = useState<ApiServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const p = await providerManagementService.getProviderByUserId(user.id);
      setProvider(p ?? null);
      if (p) {
        const [svcs, reqs] = await Promise.all([
          providerServiceService.getMyServices(),
          serviceRequestService.getOpenRequests(),
        ]);
        setServices(svcs);
        setOpenRequests(reqs);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error cargando dashboard"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, providerManagementService, providerServiceService, serviceRequestService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleAvailability = useCallback(
    async (available: boolean) => {
      if (!provider) return;
      await providerManagementService.toggleAvailability(provider.id, available);
      setProvider((prev) => (prev ? { ...prev, isAvailable: available } : null));
    },
    [provider, providerManagementService]
  );

  const activeServicesCount = services.filter((s) => s.isActive).length;

  return {
    provider,
    services,
    openRequests,
    isLoading,
    error,
    toggleAvailability,
    activeServicesCount,
    refresh: fetchData,
  };
}
