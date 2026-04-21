"use client";

import { useState, useCallback, useEffect } from "react";
import { useServices } from "@/services/ServiceContext";
import { useAuth } from "@/hooks/useAuth";
import type {
  CreateProviderPayload,
  CreateProviderServicePayload,
  SetAvailabilityPayload,
  CreateWorkZonePayload,
  CreateDocumentPayload,
  DayOfWeek,
  WorkModality,
  DocumentType,
} from "@/types/api";

const STORAGE_KEY = "taskao_onboarding_draft";
const TOTAL_STEPS = 5;

export interface PersonalData {
  displayName: string;
  headline: string;
  phone: string;
  taxId: string;
  yearsOfExperience: number;
}

export interface ServiceSelection {
  serviceId?: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  estimatedDuration: number;
}

export interface WorkZoneData {
  city: string;
  neighborhood: string;
  postalCode: string;
}

export interface WorkConfig {
  workModality: WorkModality;
  workRadius: number;
  zones: WorkZoneData[];
}

export interface AvailabilityBlock {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface DocumentData {
  documentType: DocumentType;
  documentNumber: string;
  fileUrl: string;
}

export interface OnboardingData {
  personal: PersonalData;
  services: ServiceSelection[];
  work: WorkConfig;
  availability: AvailabilityBlock[];
  documents: DocumentData[];
}

const emptyData: OnboardingData = {
  personal: { displayName: "", headline: "", phone: "", taxId: "", yearsOfExperience: 0 },
  services: [],
  work: { workModality: "HYBRID", workRadius: 20, zones: [] },
  availability: [],
  documents: [],
};

function loadDraft(): OnboardingData {
  if (typeof window === "undefined") return emptyData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptyData;
  } catch {
    return emptyData;
  }
}

function saveDraft(data: OnboardingData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useProviderOnboarding() {
  const { providerManagementService, providerServiceService } = useServices();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(emptyData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    setData(loadDraft());
  }, []);

  // Auto-save draft on data change
  useEffect(() => {
    saveDraft(data);
  }, [data]);

  const updatePersonal = useCallback((personal: PersonalData) => {
    setData((prev) => ({ ...prev, personal }));
  }, []);

  const updateServices = useCallback((services: ServiceSelection[]) => {
    setData((prev) => ({ ...prev, services }));
  }, []);

  const updateWork = useCallback((work: WorkConfig) => {
    setData((prev) => ({ ...prev, work }));
  }, []);

  const updateAvailability = useCallback((availability: AvailabilityBlock[]) => {
    setData((prev) => ({ ...prev, availability }));
  }, []);

  const updateDocuments = useCallback((documents: DocumentData[]) => {
    setData((prev) => ({ ...prev, documents }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, TOTAL_STEPS - 1)));
  }, []);

  const submit = useCallback(async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create provider
      const providerPayload: CreateProviderPayload = {
        userId: user.id,
        email: user.email,
        displayName: data.personal.displayName,
        headline: data.personal.headline || undefined,
        phone: data.personal.phone || undefined,
        taxId: data.personal.taxId || undefined,
        yearsOfExperience: data.personal.yearsOfExperience || undefined,
        workRadius: data.work.workRadius || undefined,
        workModality: data.work.workModality,
      };
      const provider = await providerManagementService.createProvider(providerPayload);

      // 2. Create services
      for (const svc of data.services) {
        const payload: CreateProviderServicePayload = {
          serviceId: svc.serviceId || undefined,
          name: svc.name,
          description: svc.description || undefined,
          price: svc.price,
          priceUnit: (svc.priceUnit as CreateProviderServicePayload["priceUnit"]) || undefined,
          estimatedDuration: svc.estimatedDuration || undefined,
        };
        await providerServiceService.createService(payload);
      }

      // 3. Set availability
      if (data.availability.length > 0) {
        const availPayload: SetAvailabilityPayload = {
          availabilities: data.availability.map((a) => ({
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
          })),
        };
        await providerManagementService.setAvailability(provider.id, availPayload);
      }

      // 4. Add work zones
      for (const zone of data.work.zones) {
        const zonePayload: CreateWorkZonePayload = {
          city: zone.city,
          neighborhood: zone.neighborhood || undefined,
          postalCode: zone.postalCode || undefined,
        };
        await providerManagementService.addWorkZone(provider.id, zonePayload);
      }

      // 5. Add documents
      for (const doc of data.documents) {
        const docPayload: CreateDocumentPayload = {
          documentType: doc.documentType,
          documentNumber: doc.documentNumber || undefined,
          fileUrl: doc.fileUrl,
        };
        await providerManagementService.addDocument(provider.id, docPayload);
      }

      clearDraft();
      return provider;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar como proveedor";
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, data, providerManagementService, providerServiceService]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    data,
    isSubmitting,
    error,
    updatePersonal,
    updateServices,
    updateWork,
    updateAvailability,
    updateDocuments,
    nextStep,
    prevStep,
    goToStep,
    submit,
    clearDraft,
  };
}
