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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let mockProvider: ApiProvider | null = null;
let mockAvailability: ApiAvailability[] = [];
let mockWorkZones: ApiWorkZone[] = [];
const mockDocuments: ApiProviderDocument[] = [];

export class MockProviderManagementService implements IProviderManagementService {
  async createProvider(data: CreateProviderPayload): Promise<ApiProvider> {
    await delay(800);
    mockProvider = {
      id: crypto.randomUUID(),
      userId: data.userId,
      email: data.email,
      displayName: data.displayName,
      headline: data.headline ?? null,
      bio: data.bio ?? null,
      phone: data.phone ?? null,
      taxId: data.taxId ?? null,
      yearsOfExperience: data.yearsOfExperience ?? null,
      hourlyRate: data.hourlyRate ?? null,
      currency: data.currency ?? "ARS",
      workRadius: data.workRadius ?? null,
      workModality: data.workModality ?? "HYBRID",
      timezone: "America/Argentina/Buenos_Aires",
      verificationStatus: "PENDING",
      rating: null,
      totalReviews: 0,
      completedJobs: 0,
      isAvailable: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return mockProvider;
  }

  async getProviderByUserId(userId: string): Promise<ApiProvider | undefined> {
    await delay(400);
    return mockProvider?.userId === userId ? mockProvider : undefined;
  }

  async getProvider(id: string): Promise<ApiProvider> {
    await delay(300);
    if (mockProvider?.id === id) return mockProvider;
    throw new Error("Provider not found");
  }

  async updateProvider(id: string, data: UpdateProviderPayload): Promise<ApiProvider> {
    await delay(500);
    if (!mockProvider || mockProvider.id !== id) throw new Error("Provider not found");
    mockProvider = { ...mockProvider, ...data, updatedAt: new Date().toISOString() } as ApiProvider;
    return mockProvider;
  }

  async getAvailability(providerId: string): Promise<ApiAvailability[]> {
    await delay(300);
    return mockAvailability.filter((a) => a.providerId === providerId);
  }

  async setAvailability(providerId: string, data: SetAvailabilityPayload): Promise<void> {
    await delay(400);
    mockAvailability = data.availabilities.map((a, i) => ({
      id: `avail-${i}`,
      providerId,
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime,
      isActive: true,
    }));
  }

  async toggleAvailability(providerId: string, available: boolean): Promise<void> {
    await delay(300);
    if (mockProvider?.id === providerId) {
      mockProvider = { ...mockProvider, isAvailable: available };
    }
  }

  async getWorkZones(providerId: string): Promise<ApiWorkZone[]> {
    await delay(300);
    return mockWorkZones.filter((z) => z.providerId === providerId);
  }

  async addWorkZone(providerId: string, data: CreateWorkZonePayload): Promise<ApiWorkZone> {
    await delay(400);
    const zone: ApiWorkZone = {
      id: crypto.randomUUID(),
      providerId,
      city: data.city,
      neighborhood: data.neighborhood ?? null,
      postalCode: data.postalCode ?? null,
      isActive: true,
    };
    mockWorkZones.push(zone);
    return zone;
  }

  async removeWorkZone(zoneId: string): Promise<void> {
    await delay(300);
    mockWorkZones = mockWorkZones.filter((z) => z.id !== zoneId);
  }

  async getDocuments(providerId: string): Promise<ApiProviderDocument[]> {
    await delay(300);
    return mockDocuments.filter((d) => d.providerId === providerId);
  }

  async addDocument(providerId: string, data: CreateDocumentPayload): Promise<ApiProviderDocument> {
    await delay(500);
    const doc: ApiProviderDocument = {
      id: crypto.randomUUID(),
      providerId,
      documentType: data.documentType,
      documentNumber: data.documentNumber ?? null,
      fileUrl: data.fileUrl,
      status: "PENDING",
      rejectionReason: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
    };
    mockDocuments.push(doc);
    return doc;
  }
}
