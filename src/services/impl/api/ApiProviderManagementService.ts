import { apiFetch } from "@/lib/api/api-client";
import type { IProviderManagementService } from "@/services/types";
import type {
  ApiProvider,
  ApiAvailability,
  ApiWorkZone,
  ApiProviderDocument,
  CreateProviderPayload,
  UpdateProviderPayload,
  SetAvailabilityPayload,
  CreateWorkZonePayload,
  CreateDocumentPayload,
} from "@/types/api";

export class ApiProviderManagementService implements IProviderManagementService {
  async createProvider(data: CreateProviderPayload): Promise<ApiProvider> {
    return apiFetch<ApiProvider>("/providers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProviderByUserId(userId: string): Promise<ApiProvider | undefined> {
    try {
      return await apiFetch<ApiProvider>(`/providers/user/${userId}`);
    } catch {
      return undefined;
    }
  }

  async getProvider(id: string): Promise<ApiProvider> {
    return apiFetch<ApiProvider>(`/providers/${id}`);
  }

  async updateProvider(id: string, data: UpdateProviderPayload): Promise<ApiProvider> {
    return apiFetch<ApiProvider>(`/providers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getAvailability(providerId: string): Promise<ApiAvailability[]> {
    return apiFetch<ApiAvailability[]>(`/providers/${providerId}/availability`);
  }

  async setAvailability(providerId: string, data: SetAvailabilityPayload): Promise<void> {
    await apiFetch(`/providers/${providerId}/availability`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async toggleAvailability(providerId: string, available: boolean): Promise<void> {
    await apiFetch(`/providers/${providerId}/available`, {
      method: "PUT",
      body: JSON.stringify({ isAvailable: available }),
    });
  }

  async addWorkZone(providerId: string, data: CreateWorkZonePayload): Promise<ApiWorkZone> {
    return apiFetch<ApiWorkZone>(`/providers/${providerId}/work-zones`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async removeWorkZone(zoneId: string): Promise<void> {
    await apiFetch(`/providers/work-zones/${zoneId}`, {
      method: "DELETE",
    });
  }

  async getDocuments(providerId: string): Promise<ApiProviderDocument[]> {
    return apiFetch<ApiProviderDocument[]>(`/providers/${providerId}/documents`);
  }

  async addDocument(providerId: string, data: CreateDocumentPayload): Promise<ApiProviderDocument> {
    return apiFetch<ApiProviderDocument>(`/providers/${providerId}/documents`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
