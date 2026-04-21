import { describe, it, expect, beforeEach } from "vitest";
import { MockServiceRequestService } from "@/services/impl/MockServiceRequestService";

describe("MockServiceRequestService", () => {
  let service: MockServiceRequestService;

  beforeEach(() => {
    service = new MockServiceRequestService();
  });

  describe("getMyRequests", () => {
    it("should return all mock requests", async () => {
      const requests = await service.getMyRequests();
      expect(requests.length).toBeGreaterThan(0);
      expect(requests[0]).toHaveProperty("id");
      expect(requests[0]).toHaveProperty("categoryName");
      expect(requests[0]).toHaveProperty("status");
      expect(requests[0]).toHaveProperty("services");
    });
  });

  describe("getOpenRequests", () => {
    it("should return only OPEN requests", async () => {
      const open = await service.getOpenRequests();
      expect(open.every((r) => r.status === "OPEN")).toBe(true);
    });
  });

  describe("getRequestById", () => {
    it("should return a request by id", async () => {
      const req = await service.getRequestById("req-1");
      expect(req).toBeDefined();
      expect(req.id).toBe("req-1");
      expect(req.categoryName).toBe("Limpieza");
    });

    it("should throw for unknown id", async () => {
      await expect(service.getRequestById("unknown")).rejects.toThrow("Request not found");
    });
  });

  describe("createRequest", () => {
    it("should create a new request and return it", async () => {
      const payload = {
        categoryId: "cat-test",
        categoryName: "Test Category",
        services: ["Service A"],
        description: "Test request",
        scheduledDate: "2026-05-01",
        scheduledTimeStart: "10:00",
        scheduledTimeEnd: "12:00",
      };

      const created = await service.createRequest(payload);
      expect(created.id).toBeDefined();
      expect(created.categoryName).toBe("Test Category");
      expect(created.status).toBe("OPEN");
      expect(created.quotesReceived).toBe(0);
      expect(created.services).toEqual(["Service A"]);
    });

    it("should add created request to the list", async () => {
      const before = await service.getMyRequests();
      const beforeCount = before.length;

      await service.createRequest({
        categoryId: "cat-new",
        categoryName: "New",
        services: ["S1"],
        description: "Desc",
        scheduledDate: "2026-06-01",
        scheduledTimeStart: "08:00",
        scheduledTimeEnd: "10:00",
      });

      const after = await service.getMyRequests();
      expect(after.length).toBe(beforeCount + 1);
    });

    it("should default urgency to NORMAL", async () => {
      const req = await service.createRequest({
        categoryId: "cat",
        categoryName: "Cat",
        services: [],
        description: "Test",
        scheduledDate: "2026-06-01",
        scheduledTimeStart: "09:00",
        scheduledTimeEnd: "11:00",
      });
      expect(req.urgency).toBe("NORMAL");
    });
  });

  describe("closeRequest", () => {
    it("should close a request", async () => {
      await service.closeRequest("req-1");
      const req = await service.getRequestById("req-1");
      expect(req.status).toBe("CLOSED");
      expect(req.closedAt).not.toBeNull();
    });
  });
});