"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useServices } from "@/services/ServiceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { ApiServiceRequest } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Mock quotes
interface Quote {
  id: string;
  providerName: string;
  providerInitials: string;
  rating: number;
  reviewCount: number;
  price: number;
  message: string;
  estimatedDuration: string;
  createdAt: string;
}

const mockQuotes: Quote[] = [
  {
    id: "q1",
    providerName: "Carlos Rodríguez",
    providerInitials: "CR",
    rating: 4.9,
    reviewCount: 156,
    price: 12000,
    message: "Hola, puedo hacerlo esta semana. Incluye materiales básicos y mano de obra. Garantía de 6 meses.",
    estimatedDuration: "2 horas",
    createdAt: "2026-04-02T10:00:00Z",
  },
  {
    id: "q2",
    providerName: "Juan Pérez",
    providerInitials: "JP",
    rating: 4.7,
    reviewCount: 42,
    price: 9500,
    message: "Buen día, tengo disponibilidad inmediata. El precio incluye diagnóstico y reparación. Materiales adicionales se cotizan aparte.",
    estimatedDuration: "1.5 horas",
    createdAt: "2026-04-02T14:00:00Z",
  },
  {
    id: "q3",
    providerName: "Roberto Gómez",
    providerInitials: "RG",
    rating: 4.6,
    reviewCount: 65,
    price: 15000,
    message: "Incluyo revisión completa, reparación y certificado de trabajo realizado. Disponible de lunes a viernes.",
    estimatedDuration: "3 horas",
    createdAt: "2026-04-03T08:00:00Z",
  },
];

const statusLabels: Record<string, string> = {
  OPEN: "Abierta",
  QUOTED: "Cotizada",
  ACCEPTED: "Aceptada",
  CLOSED: "Cerrada",
  EXPIRED: "Expirada",
};

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  QUOTED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  CLOSED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const urgencyConfig: Record<string, { label: string; icon: string; color: string }> = {
  NORMAL: { label: "Normal", icon: "schedule", color: "text-blue-500" },
  URGENT: { label: "Urgente", icon: "priority_high", color: "text-red-500" },
  FLEXIBLE: { label: "Flexible", icon: "event_available", color: "text-emerald-500" },
};

const statusTimeline = [
  { key: "OPEN", label: "Solicitud creada", icon: "add_circle" },
  { key: "QUOTED", label: "Cotizaciones recibidas", icon: "request_quote" },
  { key: "ACCEPTED", label: "Cotización aceptada", icon: "check_circle" },
  { key: "CLOSED", label: "Servicio completado", icon: "task_alt" },
];

export default function SolicitudDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const { serviceRequestService } = useServices();
  const [request, setRequest] = useState<ApiServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const req = await serviceRequestService.getRequestById(id);
        setRequest(req);
      } catch {
        setRequest(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, serviceRequestService]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="h-6 w-32 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-48 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">search_off</span>
        <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">Solicitud no encontrada</h2>
        <Link href="/dashboard/cliente/solicitudes" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Volver a solicitudes
        </Link>
      </div>
    );
  }

  const urgency = urgencyConfig[request.urgency] ?? urgencyConfig.NORMAL;
  const statusIndex = statusTimeline.findIndex((s) => s.key === request.status);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard/cliente/solicitudes"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Mis solicitudes
      </Link>

      {/* Request info */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{request.categoryName}</CardTitle>
            <span className={cn("text-xs font-bold px-3 py-1 rounded-full", statusColors[request.status] ?? statusColors.OPEN)}>
              {statusLabels[request.status] ?? request.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{request.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
              <p className="text-[11px] text-zinc-400 mb-0.5">Servicios</p>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{request.services.join(", ")}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
              <p className="text-[11px] text-zinc-400 mb-0.5">Fecha</p>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {new Date(request.scheduledDate).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
              <p className="text-[11px] text-zinc-400 mb-0.5">Horario</p>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {request.scheduledTimeStart} - {request.scheduledTimeEnd}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
              <p className="text-[11px] text-zinc-400 mb-0.5">Urgencia</p>
              <p className={cn("text-sm font-medium flex items-center gap-1", urgency.color)}>
                <span className="material-symbols-outlined text-[16px]">{urgency.icon}</span>
                {urgency.label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">timeline</span>
            Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusTimeline.map((step, i) => {
              const isCompleted = i <= statusIndex;
              const isCurrent = i === statusIndex;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isCompleted ? "bg-blue-100 dark:bg-blue-900/40" : "bg-slate-100 dark:bg-zinc-800"
                  )}>
                    <span className={cn(
                      "material-symbols-outlined text-lg",
                      isCompleted ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
                    )}>
                      {step.icon}
                    </span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-blue-600 dark:text-blue-400" : isCompleted ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400"
                  )}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quotes */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">request_quote</span>
            Cotizaciones recibidas ({mockQuotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQuotes.map((quote) => (
              <div key={quote.id} className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {quote.providerInitials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{quote.providerName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={cn("material-symbols-outlined text-xs", star <= Math.round(quote.rating) ? "text-amber-400" : "text-zinc-300")}>star</span>
                          ))}
                        </div>
                        <span className="text-[11px] text-zinc-400">{quote.rating} ({quote.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">{formatPrice(quote.price)}</p>
                    <p className="text-[11px] text-zinc-400">{quote.estimatedDuration}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">{quote.message}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" className="gap-1.5">
                    <span className="material-symbols-outlined text-base">check</span>
                    Aceptar cotización
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <span className="material-symbols-outlined text-base">chat</span>
                    Contactar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}