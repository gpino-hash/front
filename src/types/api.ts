// =============================================================================
// API Response Types — match backend DTOs exactly
// =============================================================================

// -- Generic responses --

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiSingleResponse<T> {
  message: string;
  data: T;
}

// -- Enums --

export type WorkModality = "ON_SITE" | "REMOTE" | "HYBRID";
export type VerificationStatus = "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type ProviderPriceUnit = "FIXED" | "HOURLY" | "PER_METER" | "PER_UNIT" | "QUOTE";
export type PriceUnit = "FIXED" | "HOURLY" | "PER_METER" | "PER_UNIT" | "QUOTE";
export type DocumentType = "DNI" | "PASSPORT" | "DRIVER_LICENSE" | "PROFESSIONAL_LICENSE" | "CERTIFICATE" | "INSURANCE" | "OTHER";
export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ServiceRequestStatus = "OPEN" | "QUOTED" | "ACCEPTED" | "CLOSED" | "EXPIRED";
export type Urgency = "NORMAL" | "URGENT" | "FLEXIBLE";

// -- Provider --

export interface ApiProvider {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  taxId: string | null;
  yearsOfExperience: number | null;
  hourlyRate: number | null;
  currency: string;
  workRadius: number | null;
  workModality: WorkModality;
  timezone: string;
  verificationStatus: VerificationStatus;
  rating: number | null;
  totalReviews: number;
  completedJobs: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProviderService {
  id: string;
  providerId: string;
  serviceId: string | null;
  name: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  formattedPrice: string;
  currency: string;
  priceUnit: ProviderPriceUnit;
  priceUnitLabel: string;
  estimatedDuration: number | null;
  formattedDuration: string | null;
  isActive: boolean;
  acceptsOnline: boolean;
  requiresVisit: boolean;
  terms: string | null;
  warranty: string | null;
  isFromCatalog: boolean;
  catalogService?: {
    id: string;
    name: string;
    slug: string;
    suggestedPrice: number;
    categoryName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiAvailability {
  id: string;
  providerId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ApiWorkZone {
  id: string;
  providerId: string;
  city: string;
  neighborhood: string | null;
  postalCode: string | null;
  isActive: boolean;
}

export interface ApiProviderDocument {
  id: string;
  providerId: string;
  documentType: DocumentType;
  documentNumber: string | null;
  fileUrl: string;
  status: DocumentStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

// -- Catalog --

export interface ApiPublicCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  servicesCount: number;
  providerCount: number;
  children: ApiPublicCategory[];
}

export interface ApiCatalogService {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  suggestedPrice: number;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
  priceUnit: PriceUnit;
  priceUnitLabel: string;
  estimatedDuration: number | null;
  formattedDuration: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  requiresQuote: boolean;
  tags: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

// -- Service Requests --

export interface ApiServiceRequest {
  id: string;
  customerId: string;
  categoryId: string;
  categoryName: string;
  services: string[];
  description: string;
  urgency: string;
  scheduledDate: string;
  scheduledTimeStart: string;
  scheduledTimeEnd: string;
  status: ServiceRequestStatus;
  quotesReceived: number;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

// -- Payloads (request bodies) --

export interface CreateProviderPayload {
  userId: string;
  email: string;
  displayName: string;
  headline?: string;
  bio?: string;
  phone?: string;
  taxId?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  currency?: string;
  workRadius?: number;
  workModality?: WorkModality;
}

export interface UpdateProviderPayload {
  displayName?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  taxId?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  currency?: string;
  workRadius?: number;
  workModality?: WorkModality;
  isAvailable?: boolean;
}

export interface CreateProviderServicePayload {
  serviceId?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  currency?: string;
  priceUnit?: ProviderPriceUnit;
  estimatedDuration?: number;
  isActive?: boolean;
  acceptsOnline?: boolean;
  requiresVisit?: boolean;
  terms?: string;
  warranty?: string;
}

export interface UpdateProviderServicePayload extends Partial<CreateProviderServicePayload> {}

export interface SetAvailabilityPayload {
  availabilities: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateWorkZonePayload {
  city: string;
  neighborhood?: string;
  postalCode?: string;
}

export interface CreateDocumentPayload {
  documentType: DocumentType;
  documentNumber?: string;
  fileUrl: string;
}

export interface CreateServiceRequestPayload {
  categoryId: string;
  categoryName: string;
  services: string[];
  description: string;
  urgency?: Urgency;
  scheduledDate: string;
  scheduledTimeStart: string;
  scheduledTimeEnd: string;
}
