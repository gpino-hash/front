"use client";

import { useState } from "react";
import Link from "next/link";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const urgencyLabels: Record<string, string> = {
  NORMAL: "Normal",
  URGENT: "Urgente",
  FLEXIBLE: "Flexible",
};

const urgencyColors: Record<string, string> = {
  NORMAL: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  FLEXIBLE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const tabs = [
  { key: "ALL", label: "Todas" },
  { key: "OPEN", label: "Abiertas" },
  { key: "QUOTED", label: "Cotizadas" },
  { key: "ACCEPTED", label: "Aceptadas" },
  { key: "CLOSED", label: "Cerradas" },
] as const;

export default function SolicitudesPage() {
  const { requests, isLoading, error } = useServiceRequests();
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const filtered = activeTab === "ALL" ? requests : requests.filter((r) => r.status === activeTab);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">error</span>
        <p className="text-zinc-600 dark:text-zinc-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Mis Solicitudes</h1>
        <Link
          href="/dashboard/cliente/nueva-solicitud"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">inbox</span>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            No hay solicitudes
          </h3>
          <p className="text-sm text-zinc-500">
            {activeTab === "ALL" ? "Creá tu primera solicitud para empezar." : "No hay solicitudes con este estado."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <Link key={req.id} href={`/dashboard/cliente/solicitudes/${req.id}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{req.categoryName}</h3>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", statusColors[req.status] ?? statusColors.OPEN)}>
                          {statusLabels[req.status] ?? req.status}
                        </span>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", urgencyColors[req.urgency] ?? urgencyColors.NORMAL)}>
                          {urgencyLabels[req.urgency] ?? req.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-2">{req.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">handyman</span>
                          {req.services.join(", ")}
                        </span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {new Date(req.scheduledDate).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                        </span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {req.scheduledTimeStart} - {req.scheduledTimeEnd}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.quotesReceived > 0 && (
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                          {req.quotesReceived} cotización{req.quotesReceived !== 1 ? "es" : ""}
                        </span>
                      )}
                      <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}