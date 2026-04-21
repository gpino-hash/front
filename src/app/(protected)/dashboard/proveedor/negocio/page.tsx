"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { useServices } from "@/services/ServiceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  ApiWorkZone,
  ApiProviderDocument,
  ApiAvailability,
  WorkModality,
  DayOfWeek,
  DocumentType,
  CreateWorkZonePayload,
  CreateDocumentPayload,
} from "@/types/api";

// -- Profile Form Schema --
const profileSchema = z.object({
  displayName: z.string().min(2, "Mínimo 2 caracteres").max(100),
  headline: z.string().max(150).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  hourlyRate: z.number().min(0).optional(),
  workRadius: z.number().min(1).max(500).optional(),
  workModality: z.enum(["ON_SITE", "REMOTE", "HYBRID"]).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes", TUESDAY: "Martes", WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves", FRIDAY: "Viernes", SATURDAY: "Sábado", SUNDAY: "Domingo",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  DNI: "DNI", PASSPORT: "Pasaporte", DRIVER_LICENSE: "Licencia de conducir",
  PROFESSIONAL_LICENSE: "Matrícula profesional", CERTIFICATE: "Certificado",
  INSURANCE: "Seguro", OTHER: "Otro",
};

const DOC_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function BusinessProfilePage() {
  const { provider, isLoading, refresh } = useProviderDashboard();
  const { providerManagementService } = useServices();

  const [zones, setZones] = useState<ApiWorkZone[]>([]);
  const [documents, setDocuments] = useState<ApiProviderDocument[]>([]);
  const [availability, setAvailability] = useState<ApiAvailability[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Zone form
  const [newZone, setNewZone] = useState<CreateWorkZonePayload>({ city: "" });
  // Doc form
  const [newDoc, setNewDoc] = useState<CreateDocumentPayload>({ documentType: "DNI", fileUrl: "" });
  const [showDocForm, setShowDocForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Load data when provider is available
  useEffect(() => {
    if (!provider) return;
    reset({
      displayName: provider.displayName,
      headline: provider.headline ?? "",
      bio: provider.bio ?? "",
      phone: provider.phone ?? "",
      hourlyRate: provider.hourlyRate ?? undefined,
      workRadius: provider.workRadius ?? undefined,
      workModality: provider.workModality,
    });

    const loadExtras = async () => {
      const [z, d, a] = await Promise.all([
        providerManagementService.getWorkZones(provider.id).catch(() => [] as ApiWorkZone[]),
        providerManagementService.getDocuments(provider.id).catch(() => [] as ApiProviderDocument[]),
        providerManagementService.getAvailability(provider.id).catch(() => [] as ApiAvailability[]),
      ]);
      setZones(z);
      setDocuments(d);
      setAvailability(a);
    };
    loadExtras();
  }, [provider, reset, providerManagementService]);

  const showSuccessMessage = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const onSaveProfile = async (values: ProfileFormValues) => {
    if (!provider) return;
    setIsSaving(true);
    try {
      await providerManagementService.updateProvider(provider.id, {
        displayName: values.displayName,
        headline: values.headline || undefined,
        bio: values.bio || undefined,
        phone: values.phone || undefined,
        hourlyRate: values.hourlyRate,
        workRadius: values.workRadius,
        workModality: values.workModality as WorkModality,
      });
      showSuccessMessage("Perfil actualizado");
      refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const addZone = async () => {
    if (!provider || !newZone.city.trim()) return;
    const zone = await providerManagementService.addWorkZone(provider.id, newZone);
    setZones((prev) => [...prev, zone]);
    setNewZone({ city: "" });
    showSuccessMessage("Zona agregada");
  };

  const removeZone = async (id: string) => {
    await providerManagementService.removeWorkZone(id);
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const addDocument = async () => {
    if (!provider || !newDoc.fileUrl.trim()) return;
    const doc = await providerManagementService.addDocument(provider.id, newDoc);
    setDocuments((prev) => [...prev, doc]);
    setNewDoc({ documentType: "DNI", fileUrl: "" });
    setShowDocForm(false);
    showSuccessMessage("Documento agregado");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-16 text-zinc-500">
        No se encontró tu perfil de proveedor.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Mi Negocio</h1>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Profile form */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">person</span>
            Perfil profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
            <Input label="Nombre profesional *" error={errors.displayName?.message} {...register("displayName")} />
            <Input label="Título / especialidad" error={errors.headline?.message} {...register("headline")} />
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Biografía</label>
              <textarea
                className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm resize-y"
                maxLength={2000}
                {...register("bio")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Teléfono" {...register("phone")} />
              <Input label="Tarifa por hora (ARS)" type="number" {...register("hourlyRate", { valueAsNumber: true })} />
              <Input label="Radio de trabajo (km)" type="number" {...register("workRadius", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Modalidad</label>
              <select className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm" {...register("workModality")}>
                <option value="HYBRID">Híbrido</option>
                <option value="ON_SITE">Presencial</option>
                <option value="REMOTE">Remoto</option>
              </select>
            </div>
            <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Work Zones */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">location_on</span>
            Zonas de trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {zones.map((z) => (
            <div key={z.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {z.city}{z.neighborhood ? `, ${z.neighborhood}` : ""}
              </span>
              <button onClick={() => removeZone(z.id)} className="text-zinc-400 hover:text-red-500">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Ciudad"
              value={newZone.city}
              onChange={(e) => setNewZone((prev) => ({ ...prev, city: e.target.value }))}
            />
            <Input
              placeholder="Barrio"
              value={newZone.neighborhood ?? ""}
              onChange={(e) => setNewZone((prev) => ({ ...prev, neighborhood: e.target.value }))}
            />
            <Button variant="outline" onClick={addZone} disabled={!newZone.city.trim()} className="shrink-0">
              <span className="material-symbols-outlined">add</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">description</span>
            Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
              <span className="material-symbols-outlined text-zinc-400">description</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {DOC_TYPE_LABELS[doc.documentType] ?? doc.documentType}
                </p>
                {doc.documentNumber && <p className="text-xs text-zinc-500">N° {doc.documentNumber}</p>}
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", DOC_STATUS_STYLES[doc.status])}>
                {doc.status === "PENDING" ? "Pendiente" : doc.status === "APPROVED" ? "Aprobado" : "Rechazado"}
              </span>
            </div>
          ))}

          {showDocForm ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
              <select
                value={newDoc.documentType}
                onChange={(e) => setNewDoc((prev) => ({ ...prev, documentType: e.target.value as DocumentType }))}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
              >
                {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <Input
                placeholder="URL del documento"
                value={newDoc.fileUrl}
                onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDocForm(false)} className="flex-1">Cancelar</Button>
                <Button onClick={addDocument} disabled={!newDoc.fileUrl.trim()} className="flex-1">Agregar</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowDocForm(true)} className="w-full gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Agregar documento
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Availability preview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">calendar_month</span>
            Disponibilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <p className="text-sm text-zinc-500">No hay horarios configurados.</p>
          ) : (
            <div className="space-y-2">
              {availability.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                  <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 w-24">
                    {DAY_LABELS[a.dayOfWeek] ?? a.dayOfWeek}
                  </span>
                  <span className="text-sm text-zinc-500">{a.startTime} - {a.endTime}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
