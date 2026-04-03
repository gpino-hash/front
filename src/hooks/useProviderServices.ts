"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/services/ServiceContext";
import type { ApiProviderService, CreateProviderServicePayload, UpdateProviderServicePayload } from "@/types/api";

export function useProviderServices() {
  const { providerServiceService } = useServices();
  const [services, setServices] = useState<ApiProviderService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await providerServiceService.getMyServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error cargando servicios"));
    } finally {
      setIsLoading(false);
    }
  }, [providerServiceService]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = useCallback(
    async (data: CreateProviderServicePayload) => {
      setIsSaving(true);
      try {
        const created = await providerServiceService.createService(data);
        setServices((prev) => [created, ...prev]);
        return created;
      } finally {
        setIsSaving(false);
      }
    },
    [providerServiceService]
  );

  const updateService = useCallback(
    async (id: string, data: UpdateProviderServicePayload) => {
      setIsSaving(true);
      try {
        const updated = await providerServiceService.updateService(id, data);
        setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return updated;
      } finally {
        setIsSaving(false);
      }
    },
    [providerServiceService]
  );

  const deleteService = useCallback(
    async (id: string) => {
      await providerServiceService.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    },
    [providerServiceService]
  );

  const toggleActive = useCallback(
    async (id: string) => {
      const svc = services.find((s) => s.id === id);
      if (!svc) return;
      await updateService(id, { isActive: !svc.isActive });
    },
    [services, updateService]
  );

  return {
    services,
    isLoading,
    error,
    isSaving,
    createService,
    updateService,
    deleteService,
    toggleActive,
    refresh: fetchServices,
  };
}
