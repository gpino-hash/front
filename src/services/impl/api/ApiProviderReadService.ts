import { apiFetch } from "@/lib/api/api-client";
import type { IProviderService } from "@/services/types";
import type { Provider } from "@/types";
import type { ApiProvider, ApiProviderService as ApiProviderSvc, ApiAvailability } from "@/types/api";
import { mapApiProviderToProvider } from "@/types/mappers";

export class ApiProviderReadService implements IProviderService {
  async getProviderById(id: string): Promise<Provider | undefined> {
    try {
      const provider = await apiFetch<ApiProvider>(`/providers/${id}`);
      const [services, availability] = await Promise.all([
        apiFetch<ApiProviderSvc[]>(`/provider-services/provider/${id}`).catch(() => []),
        apiFetch<ApiAvailability[]>(`/providers/${id}/availability`).catch(() => []),
      ]);
      return mapApiProviderToProvider(provider, services, availability);
    } catch {
      return undefined;
    }
  }

  async getAllProviders(): Promise<Provider[]> {
    const res = await apiFetch<{ data: ApiProvider[] } | ApiProvider[]>("/providers");
    const providers = Array.isArray(res) ? res : res.data;
    return providers.map((p) => mapApiProviderToProvider(p));
  }

  async getFeaturedProviders(): Promise<Provider[]> {
    const all = await this.getAllProviders();
    return all.filter((p) => p.isTopPro);
  }
}
