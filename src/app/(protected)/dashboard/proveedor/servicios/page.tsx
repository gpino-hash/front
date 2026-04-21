"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderServices } from "@/hooks/useProviderServices";
import { useCatalog } from "@/hooks/useCatalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ApiProviderService, CreateProviderServicePayload } from "@/types/api";

const serviceSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(150),
  description: z.string().max(5000).optional().or(z.literal("")),
  price: z.number().min(0, "El precio debe ser positivo"),
  priceUnit: z.enum(["FIXED", "HOURLY", "PER_METER", "PER_UNIT", "QUOTE"]),
  estimatedDuration: z.number().min(0).optional(),
  acceptsOnline: z.boolean().optional(),
  requiresVisit: z.boolean().optional(),
  terms: z.string().max(2000).optional().or(z.literal("")),
  warranty: z.string().max(255).optional().or(z.literal("")),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const PRICE_UNIT_LABELS: Record<string, string> = {
  FIXED: "Precio fijo",
  HOURLY: "Por hora",
  PER_METER: "Por metro",
  PER_UNIT: "Por unidad",
  QUOTE: "A cotizar",
};

export default function ProviderServicesPage() {
  const { services, isLoading, isSaving, createService, updateService, deleteService, toggleActive } =
    useProviderServices();
  const { categories } = useCatalog();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { priceUnit: "FIXED", acceptsOnline: true },
  });

  const openCreate = () => {
    reset({ name: "", description: "", price: 0, priceUnit: "FIXED", acceptsOnline: true });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (svc: ApiProviderService) => {
    reset({
      name: svc.name,
      description: svc.description ?? "",
      price: svc.price,
      priceUnit: svc.priceUnit,
      estimatedDuration: svc.estimatedDuration ?? undefined,
      acceptsOnline: svc.acceptsOnline,
      requiresVisit: svc.requiresVisit,
      terms: svc.terms ?? "",
      warranty: svc.warranty ?? "",
    });
    setEditingId(svc.id);
    setShowForm(true);
  };

  const onSubmit = async (values: ServiceFormValues) => {
    const payload: CreateProviderServicePayload = {
      name: values.name,
      description: values.description || undefined,
      price: values.price,
      priceUnit: values.priceUnit,
      estimatedDuration: values.estimatedDuration || undefined,
      acceptsOnline: values.acceptsOnline,
      requiresVisit: values.requiresVisit,
      terms: values.terms || undefined,
      warranty: values.warranty || undefined,
    };

    if (editingId) {
      await updateService(editingId, payload);
    } else {
      await createService(payload);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Mis Servicios</h1>
        <Button onClick={openCreate} className="gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo servicio
        </Button>
      </div>

      {/* Service form modal */}
      {showForm && (
        <Card className="border-orange-200 dark:border-orange-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Editar servicio" : "Nuevo servicio"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Nombre del servicio *" error={errors.name?.message} {...register("name")} />

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Descripción
                </label>
                <textarea
                  className="w-full min-h-[80px] px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm resize-y"
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Precio (ARS) *" type="number" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Tipo de precio
                  </label>
                  <select
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                    {...register("priceUnit")}
                  >
                    {Object.entries(PRICE_UNIT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <Input label="Duración (min)" type="number" {...register("estimatedDuration", { valueAsNumber: true })} />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input type="checkbox" className="rounded accent-orange-500" {...register("acceptsOnline")} />
                  Acepta online
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input type="checkbox" className="rounded accent-orange-500" {...register("requiresVisit")} />
                  Requiere visita
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Garantía" placeholder="Ej: 6 meses" {...register("warranty")} />
                <Input label="Términos" placeholder="Ej: Materiales no incluidos" {...register("terms")} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  {editingId ? "Guardar cambios" : "Crear servicio"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services list */}
      {services.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">
            handyman
          </span>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            No tenés servicios aún
          </h3>
          <p className="text-sm text-zinc-500 mb-4">Agregá tu primer servicio para empezar a recibir trabajos.</p>
          <Button onClick={openCreate}>Agregar servicio</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => (
            <Card key={svc.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full shrink-0",
                    svc.isActive ? "bg-emerald-500" : "bg-zinc-300"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {svc.formattedPrice} · {svc.priceUnitLabel}
                    {svc.formattedDuration ? ` · ${svc.formattedDuration}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(svc.id)}
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                      svc.isActive
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800"
                    )}
                  >
                    {svc.isActive ? "Activo" : "Inactivo"}
                  </button>
                  <button
                    onClick={() => openEdit(svc)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  {deleteConfirm === svc.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(svc.id)}
                        className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 text-xs text-zinc-500"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(svc.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
