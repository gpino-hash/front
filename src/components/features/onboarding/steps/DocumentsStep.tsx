"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DocumentData } from "@/hooks/useProviderOnboarding";
import type { DocumentType } from "@/types/api";

interface Props {
  data: DocumentData[];
  onNext: (data: DocumentData[]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const DOC_TYPES: { value: DocumentType; label: string; icon: string }[] = [
  { value: "DNI", label: "DNI", icon: "badge" },
  { value: "PROFESSIONAL_LICENSE", label: "Matrícula profesional", icon: "workspace_premium" },
  { value: "INSURANCE", label: "Seguro", icon: "shield" },
  { value: "CERTIFICATE", label: "Certificado", icon: "school" },
  { value: "DRIVER_LICENSE", label: "Licencia de conducir", icon: "directions_car" },
  { value: "OTHER", label: "Otro", icon: "description" },
];

export function DocumentsStep({ data, onNext, onBack, isSubmitting }: Props) {
  const [docs, setDocs] = useState<DocumentData[]>(data);
  const [adding, setAdding] = useState(false);
  const [newDoc, setNewDoc] = useState<DocumentData>({
    documentType: "DNI",
    documentNumber: "",
    fileUrl: "",
  });

  const addDoc = () => {
    if (!newDoc.fileUrl.trim()) return;
    setDocs((prev) => [...prev, { ...newDoc }]);
    setNewDoc({ documentType: "DNI", documentNumber: "", fileUrl: "" });
    setAdding(false);
  };

  const removeDoc = (idx: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
          Documentación
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Subí tus documentos para verificar tu identidad y habilitaciones (opcional)
        </p>
      </div>

      {/* Document list */}
      {docs.map((doc, idx) => {
        const docType = DOC_TYPES.find((d) => d.value === doc.documentType);
        return (
          <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500 text-lg">
                {docType?.icon ?? "description"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                {docType?.label ?? doc.documentType}
              </p>
              {doc.documentNumber && (
                <p className="text-xs text-zinc-500">N°: {doc.documentNumber}</p>
              )}
            </div>
            <button type="button" onClick={() => removeDoc(idx)} className="text-zinc-400 hover:text-red-500">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        );
      })}

      {/* Add document form */}
      {adding ? (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Tipo de documento
            </label>
            <select
              value={newDoc.documentType}
              onChange={(e) => setNewDoc((prev) => ({ ...prev, documentType: e.target.value as DocumentType }))}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Número de documento (opcional)"
            placeholder="Ej: 12.345.678"
            value={newDoc.documentNumber}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, documentNumber: e.target.value }))}
          />

          <Input
            label="URL del documento *"
            placeholder="https://..."
            value={newDoc.fileUrl}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setAdding(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="button" onClick={addDoc} disabled={!newDoc.fileUrl.trim()} className="flex-1">
              Agregar
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-zinc-700 text-zinc-500 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Agregar documento
        </button>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="button" onClick={() => onNext(docs)} isLoading={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Finalizar registro"}
        </Button>
      </div>
    </div>
  );
}
