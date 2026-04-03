import { Provider, Category, Review } from "@/types";
import type {
  ApiProvider,
  ApiProviderService,
  ApiAvailability,
  ApiWorkZone,
  ApiProviderDocument,
  ApiPublicCategory,
  ApiCatalogService,
  ApiServiceRequest,
  ApiPaginatedResponse,
  CreateProviderPayload,
  UpdateProviderPayload,
  CreateProviderServicePayload,
  UpdateProviderServicePayload,
  SetAvailabilityPayload,
  CreateWorkZonePayload,
  CreateDocumentPayload,
  CreateServiceRequestPayload,
} from "@/types/api";

// -- Existing interfaces (public read) --

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

// -- New interfaces for Sprint 2 --

export interface ICatalogService {
  getCategories(): Promise<ApiPublicCategory[]>;
  getCategoryBySlug(slug: string): Promise<ApiPublicCategory | undefined>;
  getServicesByCategory(
    categorySlug: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<ApiCatalogService>>;
  getServices(
    params?: { page?: number; limit?: number; featured?: boolean }
  ): Promise<ApiPaginatedResponse<ApiCatalogService>>;
  getFeaturedServices(): Promise<ApiCatalogService[]>;
  getServiceBySlug(slug: string): Promise<ApiCatalogService | undefined>;
}

export interface IProviderManagementService {
  createProvider(data: CreateProviderPayload): Promise<ApiProvider>;
  getProviderByUserId(userId: string): Promise<ApiProvider | undefined>;
  getProvider(id: string): Promise<ApiProvider>;
  updateProvider(id: string, data: UpdateProviderPayload): Promise<ApiProvider>;
  getAvailability(providerId: string): Promise<ApiAvailability[]>;
  setAvailability(providerId: string, data: SetAvailabilityPayload): Promise<void>;
  toggleAvailability(providerId: string, available: boolean): Promise<void>;
  addWorkZone(providerId: string, data: CreateWorkZonePayload): Promise<ApiWorkZone>;
  removeWorkZone(zoneId: string): Promise<void>;
  getDocuments(providerId: string): Promise<ApiProviderDocument[]>;
  addDocument(providerId: string, data: CreateDocumentPayload): Promise<ApiProviderDocument>;
}

export interface IProviderServiceService {
  getMyServices(): Promise<ApiProviderService[]>;
  getServiceById(id: string): Promise<ApiProviderService>;
  createService(data: CreateProviderServicePayload): Promise<ApiProviderService>;
  updateService(id: string, data: UpdateProviderServicePayload): Promise<ApiProviderService>;
  deleteService(id: string): Promise<void>;
  getPublicServices(providerId: string): Promise<ApiProviderService[]>;
}

export interface IServiceRequestService {
  createRequest(data: CreateServiceRequestPayload): Promise<ApiServiceRequest>;
  getMyRequests(): Promise<ApiServiceRequest[]>;
  getOpenRequests(): Promise<ApiServiceRequest[]>;
  getRequestById(id: string): Promise<ApiServiceRequest>;
  closeRequest(id: string): Promise<void>;
}
