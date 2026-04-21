import { describe, it, expect } from "vitest";
import { MockCatalogService } from "@/services/impl/MockCatalogService";

describe("MockCatalogService", () => {
  const service = new MockCatalogService();

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const categories = await service.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty("id");
      expect(categories[0]).toHaveProperty("name");
      expect(categories[0]).toHaveProperty("slug");
      expect(categories[0]).toHaveProperty("providerCount");
      expect(categories[0]).toHaveProperty("children");
    });

    it("should include children (sub-services) for each category", async () => {
      const categories = await service.getCategories();
      const withChildren = categories.filter((c) => c.children.length > 0);
      expect(withChildren.length).toBeGreaterThan(0);

      const child = withChildren[0].children[0];
      expect(child).toHaveProperty("id");
      expect(child).toHaveProperty("name");
      expect(child).toHaveProperty("slug");
    });
  });

  describe("getCategoryBySlug", () => {
    it("should return a category by slug", async () => {
      const cat = await service.getCategoryBySlug("limpieza");
      expect(cat).toBeDefined();
      expect(cat!.name).toBe("Limpieza");
      expect(cat!.slug).toBe("limpieza");
    });

    it("should return undefined for unknown slug", async () => {
      const cat = await service.getCategoryBySlug("non-existent-slug");
      expect(cat).toBeUndefined();
    });
  });

  describe("getServicesByCategory", () => {
    it("should return paginated services for a category", async () => {
      const result = await service.getServicesByCategory("electricidad");
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.meta).toHaveProperty("total");
      expect(result.meta).toHaveProperty("page");
      expect(result.meta).toHaveProperty("totalPages");
    });

    it("should return empty for unknown category", async () => {
      const result = await service.getServicesByCategory("unknown-category");
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it("should respect pagination params", async () => {
      const result = await service.getServicesByCategory("electricidad", { page: 1, limit: 2 });
      expect(result.data.length).toBeLessThanOrEqual(2);
      expect(result.meta.limit).toBe(2);
    });
  });

  describe("getFeaturedServices", () => {
    it("should return featured services", async () => {
      const featured = await service.getFeaturedServices();
      expect(featured.length).toBeGreaterThan(0);
      expect(featured.every((s) => s.isFeatured)).toBe(true);
    });
  });

  describe("getServiceBySlug", () => {
    it("should return undefined for unknown slug", async () => {
      const svc = await service.getServiceBySlug("nonexistent-service");
      expect(svc).toBeUndefined();
    });
  });
});