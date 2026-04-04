import { describe, it, expect } from "vitest";
import {
  mapApiProviderToProvider,
  mapApiProviderServiceToServiceOffer,
  mapApiCategoryToCategory,
  mapApiStatusToUIStatus,
} from "@/types/mappers";
import type { ApiProvider, ApiProviderService, ApiPublicCategory } from "@/types/api";

describe("mappers", () => {
  describe("mapApiProviderToProvider", () => {
    const mockApiProvider: ApiProvider = {
      id: "p1",
      userId: "u1",
      email: "carlos@test.com",
      displayName: "Carlos Rodríguez",
      headline: "Electricista Matriculado",
      bio: "15 años de experiencia",
      phone: "1155551234",
      taxId: "20-12345678-9",
      yearsOfExperience: 15,
      hourlyRate: 12500,
      currency: "ARS",
      workRadius: 20,
      workModality: "ON_SITE",
      timezone: "America/Argentina/Buenos_Aires",
      verificationStatus: "VERIFIED",
      rating: 4.9,
      totalReviews: 156,
      completedJobs: 200,
      isAvailable: true,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    };

    it("should map basic fields correctly", () => {
      const provider = mapApiProviderToProvider(mockApiProvider);
      expect(provider.id).toBe("p1");
      expect(provider.name).toBe("Carlos Rodríguez");
      expect(provider.initials).toBe("CR");
      expect(provider.specialty).toBe("Electricista Matriculado");
      expect(provider.rating).toBe(4.9);
      expect(provider.reviewCount).toBe(156);
      expect(provider.pricePerHour).toBe(12500);
      expect(provider.isVerified).toBe(true);
      expect(provider.description).toBe("15 años de experiencia");
    });

    it("should set isTopPro for 50+ completed jobs", () => {
      const provider = mapApiProviderToProvider(mockApiProvider);
      expect(provider.isTopPro).toBe(true);

      const lowJobs = { ...mockApiProvider, completedJobs: 10 };
      const notTopPro = mapApiProviderToProvider(lowJobs);
      expect(notTopPro.isTopPro).toBe(false);
    });

    it("should set isVerified based on verificationStatus", () => {
      const pending = { ...mockApiProvider, verificationStatus: "PENDING" as const };
      expect(mapApiProviderToProvider(pending).isVerified).toBe(false);
    });

    it("should handle null optional fields", () => {
      const minimal = { ...mockApiProvider, headline: null, bio: null, hourlyRate: null, rating: null };
      const provider = mapApiProviderToProvider(minimal);
      expect(provider.specialty).toBe("");
      expect(provider.description).toBe("");
      expect(provider.pricePerHour).toBe(0);
      expect(provider.rating).toBe(0);
    });

    it("should map services when provided", () => {
      const services: ApiProviderService[] = [
        {
          id: "s1", providerId: "p1", serviceId: null, name: "Instalación de ventilador",
          description: "Test", shortDescription: null, price: 8500, formattedPrice: "$8.500",
          currency: "ARS", priceUnit: "FIXED", priceUnitLabel: "Precio fijo",
          estimatedDuration: 60, formattedDuration: "1 hora", isActive: true,
          acceptsOnline: false, requiresVisit: true, terms: null, warranty: null,
          isFromCatalog: false, createdAt: "", updatedAt: "",
        },
      ];
      const provider = mapApiProviderToProvider(mockApiProvider, services);
      expect(provider.services.length).toBe(1);
      expect(provider.services[0].name).toBe("Instalación de ventilador");
      expect(provider.services[0].price).toBe(8500);
    });

    it("should map availability and zones", () => {
      const availability = [
        { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "18:00" },
      ];
      const zones = ["Palermo", "Belgrano"];
      const provider = mapApiProviderToProvider(mockApiProvider, [], availability, zones);
      expect(provider.availability[0].day).toBe("Lunes");
      expect(provider.availability[0].hours).toBe("09:00 - 18:00");
      expect(provider.zones).toEqual(["Palermo", "Belgrano"]);
    });
  });

  describe("mapApiProviderServiceToServiceOffer", () => {
    it("should map service fields correctly", () => {
      const apiService: ApiProviderService = {
        id: "s1", providerId: "p1", serviceId: null, name: "Instalación LED",
        description: "Instalación de luces LED", shortDescription: "LED lights",
        price: 15000, formattedPrice: "$15.000", currency: "ARS",
        priceUnit: "FIXED", priceUnitLabel: "Precio fijo",
        estimatedDuration: 120, formattedDuration: "2 horas",
        isActive: true, acceptsOnline: false, requiresVisit: true,
        terms: null, warranty: null, isFromCatalog: false,
        createdAt: "", updatedAt: "",
      };
      const offer = mapApiProviderServiceToServiceOffer(apiService);
      expect(offer.id).toBe("s1");
      expect(offer.name).toBe("Instalación LED");
      expect(offer.price).toBe(15000);
      expect(offer.duration).toBe("2 horas");
      expect(offer.description).toBe("Instalación de luces LED");
    });
  });

  describe("mapApiCategoryToCategory", () => {
    it("should map category with children to subServices", () => {
      const apiCat: ApiPublicCategory = {
        id: "1", name: "Limpieza", slug: "limpieza", description: "Test",
        icon: "cleaning_services", imageUrl: null, isFeatured: false,
        servicesCount: 3, providerCount: 50,
        children: [
          { id: "1-1", name: "Hogar", slug: "hogar", description: "Clean home",
            icon: "home", imageUrl: null, isFeatured: false, servicesCount: 0,
            providerCount: 0, children: [] },
        ],
      };
      const cat = mapApiCategoryToCategory(apiCat);
      expect(cat.name).toBe("Limpieza");
      expect(cat.slug).toBe("limpieza");
      expect(cat.icon).toBe("cleaning_services");
      expect(cat.providerCount).toBe(50);
      expect(cat.subServices.length).toBe(1);
      expect(cat.subServices[0].name).toBe("Hogar");
    });
  });

  describe("mapApiStatusToUIStatus", () => {
    it("should map OPEN to PENDING_QUOTE", () => {
      expect(mapApiStatusToUIStatus("OPEN")).toBe("PENDING_QUOTE");
    });
    it("should map QUOTED to QUOTED", () => {
      expect(mapApiStatusToUIStatus("QUOTED")).toBe("QUOTED");
    });
    it("should map ACCEPTED to ACCEPTED", () => {
      expect(mapApiStatusToUIStatus("ACCEPTED")).toBe("ACCEPTED");
    });
    it("should map CLOSED to CANCELLED", () => {
      expect(mapApiStatusToUIStatus("CLOSED")).toBe("CANCELLED");
    });
    it("should map EXPIRED to CANCELLED", () => {
      expect(mapApiStatusToUIStatus("EXPIRED")).toBe("CANCELLED");
    });
  });
});