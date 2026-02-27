import { Provider, Category, Review } from "@/types";

export interface IProviderService {
    getProviderById(id: string): Promise<Provider | undefined>;
    getAllProviders(): Promise<Provider[]>;
    getFeaturedProviders(): Promise<Provider[]>;
}

export interface IReviewService {
    getReviewsByProviderId(providerId: string): Promise<Review[]>;
}

export interface ICategoryService {
    getAllCategories(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | undefined>;
}
