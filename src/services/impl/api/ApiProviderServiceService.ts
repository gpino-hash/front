import { apiFetch } from "@/lib/api/api-client";
import type { IProviderServiceService } from "@/services/types";
import type {
  ApiProviderService,
  CreateProviderServicePayload,
  UpdateProviderServicePayload,
} from "@/types/api";

export class ApiProviderServiceService implements IProviderServiceService {
  async getMyServices(): Promise<ApiProviderService[]> {
    const res = await apiFetch<ApiProviderService[] | { data: ApiProviderService[] }>(
      "/provider-services"
    );
    return Array.isArray(res) ? res : res.data;
  }

  async getServiceById(id: string): Promise<ApiProviderService> {
    return apiFetch<ApiProviderService>(`/provider-services/${id}`);
  }

  async createService(data: CreateProviderServicePayload): Promise<ApiProviderService> {
    return apiFetch<ApiProviderService>("/provider-services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(
    id: string,
    data: UpdateProviderServicePayload
  ): Promise<ApiProviderService> {
    return apiFetch<ApiProviderService>(`/provider-services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string): Promise<void> {
    await apiFetch(`/provider-services/${id}`, { method: "DELETE" });
  }

  async getPublicServices(providerId: string): Promise<ApiProviderService[]> {
    const res = await apiFetch<ApiProviderService[] | { data: ApiProviderService[] }>(
      `/provider-services/provider/${providerId}`
    );
    return Array.isArray(res) ? res : res.data;
  }
}
