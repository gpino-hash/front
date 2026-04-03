"use client";

import { useRouter } from "next/navigation";
import { useProviderOnboarding } from "@/hooks/useProviderOnboarding";
import { StepIndicator } from "@/components/features/onboarding/StepIndicator";
import { PersonalDataStep } from "@/components/features/onboarding/steps/PersonalDataStep";
import { ServicesSelectionStep } from "@/components/features/onboarding/steps/ServicesSelectionStep";
import { WorkZonesStep } from "@/components/features/onboarding/steps/WorkZonesStep";
import { AvailabilityStep } from "@/components/features/onboarding/steps/AvailabilityStep";
import { DocumentsStep } from "@/components/features/onboarding/steps/DocumentsStep";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
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
  } = useProviderOnboarding();

  const handleFinalSubmit = async (docs: typeof data.documents) => {
    updateDocuments(docs);
    try {
      await submit();
      router.push("/dashboard/proveedor/pendiente");
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-zinc-950 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-2">
            Registrate como proveedor
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Completá tu perfil para empezar a recibir trabajos en Taskao
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={goToStep}
        />

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
            <span className="material-symbols-outlined text-lg mr-2 align-middle">error</span>
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
          {currentStep === 0 && (
            <PersonalDataStep
              data={data.personal}
              onNext={(personal) => {
                updatePersonal(personal);
                nextStep();
              }}
            />
          )}
          {currentStep === 1 && (
            <ServicesSelectionStep
              data={data.services}
              onNext={(services) => {
                updateServices(services);
                nextStep();
              }}
              onBack={prevStep}
            />
          )}
          {currentStep === 2 && (
            <WorkZonesStep
              data={data.work}
              onNext={(work) => {
                updateWork(work);
                nextStep();
              }}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <AvailabilityStep
              data={data.availability}
              onNext={(availability) => {
                updateAvailability(availability);
                nextStep();
              }}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <DocumentsStep
              data={data.documents}
              onNext={handleFinalSubmit}
              onBack={prevStep}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
