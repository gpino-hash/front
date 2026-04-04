"use client";

import { useServiceRequests } from "@/hooks/useServiceRequests";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const urgencyConfig: Record<string, { label: string; color: string }> = {
  NORMAL: { label: "Normal", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  URGENT: { label: "Urgente", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  FLEXIBLE: { label: "Flexible", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
};

export default function OportunidadesPage() {
  const { requests, isLoading } = useServiceRequests();

  const openRequests = requests.filter((r) => r.status === "OPEN" || r.status === "QUOTED");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Oportunidades</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Solicitudes abiertas de clientes que coinciden con tus servicios
        </p>
      </div>

      {openRequests.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">work</span>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            No hay oportunidades nuevas
          </h3>
          <p className="text-sm text-zinc-500">
            Cuando haya solicitudes que coincidan con tus servicios, aparecerán acá.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {openRequests.map((req) => {
            const urgency = urgencyConfig[req.urgency] ?? urgencyConfig.NORMAL;
            return (
              <Card key={req.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {req.categoryName}
                        </h3>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", urgency.color)}>
                          {urgency.label}
                        </span>
                        {req.quotesReceived > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            {req.quotesReceived} cotización{req.quotesReceived !== 1 ? "es" : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                        {req.description}
                      </p>
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

                    <Button size="sm" className="shrink-0 gap-1.5">
                      <span className="material-symbols-outlined text-base">send</span>
                      Enviar cotización
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
