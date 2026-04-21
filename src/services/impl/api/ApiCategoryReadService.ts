import { apiFetch } from "@/lib/api/api-client";
import type { ICategoryService } from "@/services/types";
import type { Category } from "@/types";
import type { ApiPublicCategory } from "@/types/api";
import { mapApiCategoryToCategory } from "@/types/mappers";

export class ApiCategoryReadService implements ICategoryService {
  async getAllCategories(): Promise<Category[]> {
    const cats = await apiFetch<ApiPublicCategory[]>("/catalog/categories");
    return cats.map(mapApiCategoryToCategory);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const cat = await apiFetch<ApiPublicCategory>(`/catalog/categories/${slug}`);
      return mapApiCategoryToCategory(cat);
    } catch {
      return undefined;
    }
  }
}
