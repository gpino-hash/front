"use client";

import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/services/ServiceContext";
import type { ApiServiceRequest, CreateServiceRequestPayload } from "@/types/api";

export function useServiceRequests() {
  const { serviceRequestService } = useServices();
  const [requests, setRequests] = useState<ApiServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceRequestService.getMyRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error cargando solicitudes"));
    } finally {
      setIsLoading(false);
    }
  }, [serviceRequestService]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = useCallback(
    async (data: CreateServiceRequestPayload) => {
      setIsSubmitting(true);
      try {
        const created = await serviceRequestService.createRequest(data);
        setRequests((prev) => [created, ...prev]);
        return created;
      } finally {
        setIsSubmitting(false);
      }
    },
    [serviceRequestService]
  );

  const closeRequest = useCallback(
    async (id: string) => {
      await serviceRequestService.closeRequest(id);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "CLOSED" as const, closedAt: new Date().toISOString() } : r
        )
      );
    },
    [serviceRequestService]
  );

  return {
    requests,
    isLoading,
    error,
    isSubmitting,
    createRequest,
    closeRequest,
    refresh: fetchRequests,
  };
}
