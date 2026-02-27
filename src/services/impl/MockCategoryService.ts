import { Category } from "@/types";
import { ICategoryService } from "../types";
import { categories } from "@/lib/mock-data/categories";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockCategoryService implements ICategoryService {
    async getAllCategories(): Promise<Category[]> {
        await delay(1200);
        return categories;
    }

    async getCategoryBySlug(slug: string): Promise<Category | undefined> {
        await delay(400);
        return categories.find(c => c.slug === slug);
    }
}
