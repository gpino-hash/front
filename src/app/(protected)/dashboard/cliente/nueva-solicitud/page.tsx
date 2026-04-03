"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCatalog } from "@/hooks/useCatalog";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ApiPublicCategory, CreateServiceRequestPayload, Urgency } from "@/types/api";

const detailsSchema = z.object({
  description: z.string().min(10, "Mínimo 10 caracteres").max(2000),
  urgency: z.enum(["NORMAL", "URGENT", "FLEXIBLE"]),
  scheduledDate: z.string().min(1, "Seleccioná una fecha"),
  scheduledTimeStart: z.string().min(1, "Seleccioná hora de inicio"),
  scheduledTimeEnd: z.string().min(1, "Seleccioná hora de fin"),
});

type DetailsValues = z.infer<typeof detailsSchema>;

const URGENCY_OPTIONS: { value: Urgency; label: string; icon: string; description: string }[] = [
  { value: "NORMAL", label: "Normal", icon: "schedule", description: "Sin apuro, fecha flexible" },
  { value: "URGENT", label: "Urgente", icon: "bolt", description: "Lo necesito lo antes posible" },
  { value: "FLEXIBLE", label: "Flexible", icon: "event_available", description: "Puedo esperar por la mejor opción" },
];

export default function NewServiceRequestPage() {
  const router = useRouter();
  const { categories, isLoading: loadingCats } = useCatalog();
  const { createRequest, isSubmitting } = useServiceRequests();

  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ApiPublicCategory | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { urgency: "NORMAL" },
  });

  const watchedUrgency = watch("urgency");

  const toggleService = (name: string) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const goToDetails = () => {
    if (!selectedCategory || selectedServices.length === 0) return;
    setStep(1);
  };

  const onSubmit = async (values: DetailsValues) => {
    if (!selectedCategory) return;
    setError(null);
    try {
      const payload: CreateServiceRequestPayload = {
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        services: selectedServices,
        description: values.description,
        urgency: values.urgency as Urgency,
        scheduledDate: values.scheduledDate,
        scheduledTimeStart: values.scheduledTimeStart,
        scheduledTimeEnd: values.scheduledTimeEnd,
      };
      await createRequest(payload);
      router.push("/dashboard/cliente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la solicitud");
    }
  };

  // Step 0: Category + Services selection
  if (step === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-1">
            Nueva solicitud
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Paso 1 de 2: Elegí la categoría y los servicios que necesitás
          </p>
        </div>

        {/* Category grid */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Categoría</h3>
          {loadingCats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-20 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedServices([]);
                  }}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    selectedCategory?.id === cat.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                  )}
                >
                  <span className={cn(
                    "material-symbols-outlined text-2xl mb-1",
                    selectedCategory?.id === cat.id ? "text-primary" : "text-zinc-400"
                  )}>
                    {cat.icon ?? "category"}
                  </span>
                  <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{cat.name}</p>
                  <p className="text-[11px] text-zinc-400">{cat.providerCount} profesionales</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services from selected category */}
        {selectedCategory && selectedCategory.children.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              Servicios en {selectedCategory.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedCategory.children.map((child) => {
                const isSelected = selectedServices.includes(child.name);
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => toggleService(child.name)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                    )}
                  >
                    <span className={cn(
                      "material-symbols-outlined text-lg",
                      isSelected ? "text-primary" : "text-zinc-400"
                    )}>
                      {isSelected ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{child.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={goToDetails} disabled={!selectedCategory || selectedServices.length === 0}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: Details + Submit
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-1">
          Nueva solicitud
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Paso 2 de 2: Detallá qué necesitás y cuándo
        </p>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {selectedCategory?.name}
        </p>
        <p className="text-xs text-zinc-500 mt-1">{selectedServices.join(", ")}</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Descripción del trabajo *
          </label>
          <textarea
            className={cn(
              "w-full min-h-[120px] px-4 py-3 rounded-xl border bg-white dark:bg-zinc-900 text-sm resize-y",
              errors.description
                ? "border-red-300 dark:border-red-800"
                : "border-slate-200 dark:border-zinc-700"
            )}
            placeholder="Describí con detalle qué necesitás..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Urgencia
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("urgency", opt.value)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  watchedUrgency === opt.value
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-slate-200 dark:border-zinc-700"
                )}
              >
                <span className={cn(
                  "material-symbols-outlined text-xl mb-1",
                  watchedUrgency === opt.value ? "text-primary" : "text-zinc-400"
                )}>
                  {opt.icon}
                </span>
                <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{opt.label}</p>
                <p className="text-[11px] text-zinc-500">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date and time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Fecha *"
            type="date"
            error={errors.scheduledDate?.message}
            {...register("scheduledDate")}
          />
          <Input
            label="Hora inicio *"
            type="time"
            error={errors.scheduledTimeStart?.message}
            {...register("scheduledTimeStart")}
          />
          <Input
            label="Hora fin *"
            type="time"
            error={errors.scheduledTimeEnd?.message}
            {...register("scheduledTimeEnd")}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => setStep(0)}>
            Atrás
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Enviar solicitud
          </Button>
        </div>
      </form>
    </div>
  );
}
