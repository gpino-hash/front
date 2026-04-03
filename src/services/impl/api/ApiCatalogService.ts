import { apiFetch } from "@/lib/api/api-client";
import type { ICatalogService } from "@/services/types";
import type {
  ApiPublicCategory,
  ApiCatalogService as ApiCatalogServiceType,
  ApiPaginatedResponse,
} from "@/types/api";

export class ApiCatalogService implements ICatalogService {
  async getCategories(): Promise<ApiPublicCategory[]> {
    return apiFetch<ApiPublicCategory[]>("/catalog/categories");
  }

  async getCategoryBySlug(slug: string): Promise<ApiPublicCategory | undefined> {
    try {
      return await apiFetch<ApiPublicCategory>(`/catalog/categories/${slug}`);
    } catch {
      return undefined;
    }
  }

  async getServicesByCategory(
    categorySlug: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<ApiCatalogServiceType>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiFetch(`/catalog/categories/${categorySlug}/services${qs ? `?${qs}` : ""}`);
  }

  async getServices(
    params?: { page?: number; limit?: number; featured?: boolean }
  ): Promise<ApiPaginatedResponse<ApiCatalogServiceType>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.featured) searchParams.set("featured", "true");
    const qs = searchParams.toString();
    return apiFetch(`/catalog/services${qs ? `?${qs}` : ""}`);
  }

  async getFeaturedServices(): Promise<ApiCatalogServiceType[]> {
    return apiFetch<ApiCatalogServiceType[]>("/catalog/services/featured");
  }

  async getServiceBySlug(slug: string): Promise<ApiCatalogServiceType | undefined> {
    try {
      return await apiFetch<ApiCatalogServiceType>(`/catalog/services/${slug}`);
    } catch {
      return undefined;
    }
  }
}
