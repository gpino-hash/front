import { apiFetch } from "@/lib/api/api-client";
import type { IServiceRequestService } from "@/services/types";
import type {
  ApiServiceRequest,
  CreateServiceRequestPayload,
} from "@/types/api";

export class ApiServiceRequestService implements IServiceRequestService {
  async createRequest(data: CreateServiceRequestPayload): Promise<ApiServiceRequest> {
    return apiFetch<ApiServiceRequest>("/service-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyRequests(): Promise<ApiServiceRequest[]> {
    const res = await apiFetch<ApiServiceRequest[] | { data: ApiServiceRequest[] }>(
      "/service-requests/my"
    );
    return Array.isArray(res) ? res : res.data;
  }

  async getOpenRequests(): Promise<ApiServiceRequest[]> {
    const res = await apiFetch<ApiServiceRequest[] | { data: ApiServiceRequest[] }>(
      "/service-requests/open"
    );
    return Array.isArray(res) ? res : res.data;
  }

  async getRequestById(id: string): Promise<ApiServiceRequest> {
    return apiFetch<ApiServiceRequest>(`/service-requests/${id}`);
  }

  async closeRequest(id: string): Promise<void> {
    await apiFetch(`/service-requests/${id}/close`, { method: "POST" });
  }
}
