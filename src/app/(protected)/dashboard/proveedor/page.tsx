"use client";

import Link from "next/link";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function ProviderDashboardPage() {
  const {
    provider,
    services,
    openRequests,
    isLoading,
    error,
    toggleAvailability,
    activeServicesCount,
  } = useProviderDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
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

  if (!provider) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">
          person_add
        </span>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
          Completá tu registro
        </h2>
        <p className="text-zinc-500 mb-6">
          Para acceder al dashboard, completá tu perfil de proveedor.
        </p>
        <Link href="/perfil/onboarding">
          <Button>Comenzar registro</Button>
        </Link>
      </div>
    );
  }

  const stats = [
    {
      icon: "handyman",
      label: "Servicios activos",
      value: activeServicesCount,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      icon: "work",
      label: "Solicitudes abiertas",
      value: openRequests.length,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: "star",
      label: "Calificación",
      value: provider.rating ? provider.rating.toFixed(1) : "—",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: "check_circle",
      label: "Trabajos completados",
      value: provider.completedJobs,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">
            Hola, {provider.displayName.split(" ")[0]} 👋
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Acá tenés un resumen de tu actividad
          </p>
        </div>

        {/* Availability toggle */}
        <button
          onClick={() => toggleAvailability(!provider.isAvailable)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            provider.isAvailable
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              provider.isAvailable ? "bg-emerald-500" : "bg-zinc-400"
            }`}
          />
          {provider.isAvailable ? "Disponible" : "No disponible"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <span className={`material-symbols-outlined text-2xl ${stat.color}`}>
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{stat.value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/proveedor/servicios">
          <Button variant="outline" className="gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Agregar servicio
          </Button>
        </Link>
        <Link href="/dashboard/proveedor/negocio">
          <Button variant="outline" className="gap-2">
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar perfil
          </Button>
        </Link>
        <Link href="/dashboard/proveedor/oportunidades">
          <Button variant="outline" className="gap-2">
            <span className="material-symbols-outlined text-lg">visibility</span>
            Ver oportunidades
          </Button>
        </Link>
      </div>

      {/* Open requests */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">work</span>
            Solicitudes abiertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {openRequests.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-700 mb-2 block">
                inbox
              </span>
              <p className="text-sm text-zinc-500">No hay solicitudes abiertas por el momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openRequests.slice(0, 5).map((req) => (
                <div
                  key={req.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                        {req.categoryName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          urgencyColors[req.urgency] ?? urgencyColors.NORMAL
                        }`}
                      >
                        {urgencyLabels[req.urgency] ?? req.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {req.description}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {req.services.join(", ")} · {req.scheduledDate}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {req.quotesReceived} cotización{req.quotesReceived !== 1 ? "es" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My services preview */}
      {services.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">handyman</span>
                Mis servicios
              </CardTitle>
              <Link
                href="/dashboard/proveedor/servicios"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Ver todos →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.slice(0, 4).map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                      {svc.name}
                    </p>
                    <p className="text-xs text-zinc-500">{svc.formattedPrice} · {svc.priceUnitLabel}</p>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      svc.isActive ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
