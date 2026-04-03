import type { ICatalogService } from "@/services/types";
import type {
  ApiPublicCategory,
  ApiCatalogService as ApiCatalogServiceType,
  ApiPaginatedResponse,
} from "@/types/api";
import { categories } from "@/lib/mock-data/categories";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function categoriesToApi(cats: typeof categories): ApiPublicCategory[] {
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    imageUrl: null,
    isFeatured: false,
    servicesCount: c.subServices?.length ?? 0,
    providerCount: c.providerCount,
    children: (c.subServices ?? []).map((sub, i) => ({
      id: `${c.id}-sub-${i}`,
      name: sub.name,
      slug: `${c.slug}-${sub.name.toLowerCase().replace(/\s+/g, "-")}`,
      description: sub.description,
      icon: sub.icon,
      imageUrl: null,
      isFeatured: false,
      servicesCount: 0,
      providerCount: 0,
      children: [],
    })),
  }));
}

function subToService(
  sub: { name: string; icon: string; description: string },
  categoryId: string,
  categorySlug: string,
  index: number
): ApiCatalogServiceType {
  return {
    id: `svc-${categoryId}-${index}`,
    categoryId,
    name: sub.name,
    slug: `${categorySlug}-${sub.name.toLowerCase().replace(/\s+/g, "-")}`,
    description: sub.description,
    shortDescription: sub.description,
    imageUrl: null,
    suggestedPrice: 5000 + Math.floor(Math.random() * 15000),
    minPrice: null,
    maxPrice: null,
    currency: "ARS",
    priceUnit: "FIXED",
    priceUnitLabel: "Precio fijo",
    estimatedDuration: 60 + Math.floor(Math.random() * 120),
    formattedDuration: "1-3 horas",
    sortOrder: index,
    isActive: true,
    isFeatured: index === 0,
    requiresQuote: false,
    tags: [],
    category: { id: categoryId, name: "", slug: categorySlug },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export class MockCatalogService implements ICatalogService {
  async getCategories(): Promise<ApiPublicCategory[]> {
    await delay(600);
    return categoriesToApi(categories);
  }

  async getCategoryBySlug(slug: string): Promise<ApiPublicCategory | undefined> {
    await delay(300);
    const all = categoriesToApi(categories);
    return all.find((c) => c.slug === slug);
  }

  async getServicesByCategory(
    categorySlug: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<ApiCatalogServiceType>> {
    await delay(500);
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat) return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };

    const services = (cat.subServices ?? []).map((sub, i) =>
      subToService(sub, cat.id, cat.slug, i)
    );
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const start = (page - 1) * limit;
    return {
      data: services.slice(start, start + limit),
      meta: { total: services.length, page, limit, totalPages: Math.ceil(services.length / limit) },
    };
  }

  async getServices(
    params?: { page?: number; limit?: number; featured?: boolean }
  ): Promise<ApiPaginatedResponse<ApiCatalogServiceType>> {
    await delay(500);
    let services: ApiCatalogServiceType[] = [];
    for (const cat of categories) {
      (cat.subServices ?? []).forEach((sub, i) => {
        services.push(subToService(sub, cat.id, cat.slug, i));
      });
    }
    if (params?.featured) services = services.filter((s) => s.isFeatured);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const start = (page - 1) * limit;
    return {
      data: services.slice(start, start + limit),
      meta: { total: services.length, page, limit, totalPages: Math.ceil(services.length / limit) },
    };
  }

  async getFeaturedServices(): Promise<ApiCatalogServiceType[]> {
    await delay(400);
    const res = await this.getServices({ featured: true });
    return res.data;
  }

  async getServiceBySlug(slug: string): Promise<ApiCatalogServiceType | undefined> {
    await delay(300);
    const res = await this.getServices({ limit: 100 });
    return res.data.find((s) => s.slug === slug);
  }
}
