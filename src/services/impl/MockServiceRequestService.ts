import type { IServiceRequestService } from "@/services/types";
import type { ApiServiceRequest, CreateServiceRequestPayload } from "@/types/api";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockRequests: ApiServiceRequest[] = [
  {
    id: "req-1",
    customerId: "mock-user",
    categoryId: "cat-1",
    categoryName: "Limpieza",
    services: ["Limpieza profunda", "Limpieza de cocina"],
    description: "Necesito una limpieza profunda de mi departamento de 3 ambientes.",
    urgency: "NORMAL",
    scheduledDate: "2026-04-10",
    scheduledTimeStart: "09:00",
    scheduledTimeEnd: "13:00",
    status: "OPEN",
    quotesReceived: 2,
    createdAt: "2026-03-28T10:00:00Z",
    updatedAt: "2026-03-28T10:00:00Z",
    closedAt: null,
  },
  {
    id: "req-2",
    customerId: "mock-user",
    categoryId: "cat-3",
    categoryName: "Electricidad",
    services: ["Instalación de luminarias"],
    description: "Instalar 5 luminarias LED en living y habitaciones.",
    urgency: "FLEXIBLE",
    scheduledDate: "2026-04-15",
    scheduledTimeStart: "14:00",
    scheduledTimeEnd: "18:00",
    status: "QUOTED",
    quotesReceived: 3,
    createdAt: "2026-03-25T15:00:00Z",
    updatedAt: "2026-03-27T09:00:00Z",
    closedAt: null,
  },
  {
    id: "req-3",
    customerId: "mock-user",
    categoryId: "cat-2",
    categoryName: "Plomería",
    services: ["Reparación de canilla"],
    description: "Canilla del baño pierde agua constantemente.",
    urgency: "URGENT",
    scheduledDate: "2026-04-02",
    scheduledTimeStart: "08:00",
    scheduledTimeEnd: "10:00",
    status: "ACCEPTED",
    quotesReceived: 1,
    createdAt: "2026-03-20T08:00:00Z",
    updatedAt: "2026-03-21T11:00:00Z",
    closedAt: null,
  },
];

export class MockServiceRequestService implements IServiceRequestService {
  async createRequest(data: CreateServiceRequestPayload): Promise<ApiServiceRequest> {
    await delay(700);
    const req: ApiServiceRequest = {
      id: crypto.randomUUID(),
      customerId: "mock-user",
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      services: data.services,
      description: data.description,
      urgency: data.urgency ?? "NORMAL",
      scheduledDate: data.scheduledDate,
      scheduledTimeStart: data.scheduledTimeStart,
      scheduledTimeEnd: data.scheduledTimeEnd,
      status: "OPEN",
      quotesReceived: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null,
    };
    mockRequests.unshift(req);
    return req;
  }

  async getMyRequests(): Promise<ApiServiceRequest[]> {
    await delay(500);
    return mockRequests;
  }

  async getOpenRequests(): Promise<ApiServiceRequest[]> {
    await delay(500);
    return mockRequests.filter((r) => r.status === "OPEN");
  }

  async getRequestById(id: string): Promise<ApiServiceRequest> {
    await delay(300);
    const req = mockRequests.find((r) => r.id === id);
    if (!req) throw new Error("Request not found");
    return req;
  }

  async closeRequest(id: string): Promise<void> {
    await delay(400);
    const req = mockRequests.find((r) => r.id === id);
    if (req) {
      req.status = "CLOSED";
      req.closedAt = new Date().toISOString();
    }
  }
}
