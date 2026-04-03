import type { IProviderServiceService } from "@/services/types";
import type {
  ApiProviderService,
  CreateProviderServicePayload,
  UpdateProviderServicePayload,
} from "@/types/api";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let mockServices: ApiProviderService[] = [];

function formatDuration(minutes: number | null | undefined): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h} hora${h > 1 ? "s" : ""}`;
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(price);
}

const PRICE_UNIT_LABELS: Record<string, string> = {
  FIXED: "Precio fijo",
  HOURLY: "Por hora",
  PER_METER: "Por metro",
  PER_UNIT: "Por unidad",
  QUOTE: "A cotizar",
};

export class MockProviderServiceService implements IProviderServiceService {
  async getMyServices(): Promise<ApiProviderService[]> {
    await delay(500);
    return mockServices;
  }

  async getServiceById(id: string): Promise<ApiProviderService> {
    await delay(300);
    const svc = mockServices.find((s) => s.id === id);
    if (!svc) throw new Error("Service not found");
    return svc;
  }

  async createService(data: CreateProviderServicePayload): Promise<ApiProviderService> {
    await delay(600);
    const svc: ApiProviderService = {
      id: crypto.randomUUID(),
      providerId: "mock-provider",
      serviceId: data.serviceId ?? null,
      name: data.name,
      description: data.description ?? null,
      shortDescription: data.shortDescription ?? null,
      price: data.price,
      formattedPrice: formatPrice(data.price, data.currency ?? "ARS"),
      currency: data.currency ?? "ARS",
      priceUnit: data.priceUnit ?? "FIXED",
      priceUnitLabel: PRICE_UNIT_LABELS[data.priceUnit ?? "FIXED"],
      estimatedDuration: data.estimatedDuration ?? null,
      formattedDuration: formatDuration(data.estimatedDuration),
      isActive: data.isActive ?? true,
      acceptsOnline: data.acceptsOnline ?? true,
      requiresVisit: data.requiresVisit ?? false,
      terms: data.terms ?? null,
      warranty: data.warranty ?? null,
      isFromCatalog: !!data.serviceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockServices.push(svc);
    return svc;
  }

  async updateService(id: string, data: UpdateProviderServicePayload): Promise<ApiProviderService> {
    await delay(500);
    const idx = mockServices.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Service not found");
    const updated = {
      ...mockServices[idx],
      ...data,
      formattedPrice: data.price != null
        ? formatPrice(data.price, data.currency ?? mockServices[idx].currency)
        : mockServices[idx].formattedPrice,
      priceUnitLabel: data.priceUnit
        ? PRICE_UNIT_LABELS[data.priceUnit]
        : mockServices[idx].priceUnitLabel,
      formattedDuration:
        data.estimatedDuration !== undefined
          ? formatDuration(data.estimatedDuration)
          : mockServices[idx].formattedDuration,
      updatedAt: new Date().toISOString(),
    } as ApiProviderService;
    mockServices[idx] = updated;
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await delay(400);
    mockServices = mockServices.filter((s) => s.id !== id);
  }

  async getPublicServices(providerId: string): Promise<ApiProviderService[]> {
    await delay(400);
    return mockServices.filter((s) => s.providerId === providerId && s.isActive);
  }
}
