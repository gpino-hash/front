"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  type ServiceRequest,
  type RequestStatus,
  MOCK_REQUESTS,
  PROVIDERS_MAP,
  STATUS_MAP,
  CATEGORY_ICONS,
  ACTIVE_STATUSES,
  formatPrice,
  formatDate,
} from "@/lib/mock-data/client-requests";

/* ═══════════════════════════════════════════════════════
   Client Dashboard Page
   ═══════════════════════════════════════════════════════ */

type FilterTab = "active" | "all" | "completed";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>("active");
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [cancelId, setCancelId] = useState<string | null>(null);

  /* ── Stats ───────────────────────────────────── */
  const stats = useMemo(() => {
    const active = requests.filter((r) => ACTIVE_STATUSES.includes(r.status)).length;
    const completed = requests.filter((r) => r.status === "COMPLETED").length;
    const spent = requests
      .filter((r) => r.status === "COMPLETED" && r.quotedPrice)
      .reduce((s, r) => s + (r.quotedPrice ?? 0), 0);
    const pending = requests.filter((r) => r.status === "PENDING_QUOTE" || r.status === "QUOTED").length;
    return { active, completed, spent, pending };
  }, [requests]);

  /* ── Filtered ────────────────────────────────── */
  const filtered = useMemo(() => {
    let list: ServiceRequest[];
    if (filter === "active") list = requests.filter((r) => ACTIVE_STATUSES.includes(r.status));
    else if (filter === "completed") list = requests.filter((r) => r.status === "COMPLETED" || r.status === "CANCELLED");
    else list = [...requests];
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, filter]);

  /* ── Actions ─────────────────────────────────── */
  const acceptQuote = useCallback((id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "ACCEPTED" as RequestStatus } : r));
  }, []);

  const confirmCancel = useCallback(() => {
    if (!cancelId) return;
    setRequests((prev) => prev.map((r) => r.id === cancelId ? { ...r, status: "CANCELLED" as RequestStatus } : r));
    setCancelId(null);
  }, [cancelId]);

  const cancelTarget = cancelId ? requests.find((r) => r.id === cancelId) : null;
  const nav = (path: string) => router.push(path);

  /* ── Badge styles ────────────────────────────── */
  const badgeClass: Record<string, string> = {
    blue:    "bg-blue-100 text-blue-800",
    amber:   "bg-amber-100 text-amber-800",
    purple:  "bg-purple-100 text-purple-800",
    emerald: "bg-emerald-100 text-emerald-800",
    red:     "bg-red-100 text-red-800",
    orange:  "bg-orange-100 text-orange-800",
  };

  const progressClass: Record<string, string> = {
    blue: "bg-primary", amber: "bg-amber-400", purple: "bg-purple-500",
    emerald: "bg-emerald-500", red: "bg-red-400", orange: "bg-orange-500",
  };

  /* ── Button base styles ──────────────────────── */
  const btnPrimary = "bg-primary hover:bg-primary-dark text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shadow-sm shadow-primary/20 flex items-center justify-center gap-1 flex-1 sm:flex-initial";
  const btnOutline = "border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial";
  const btnDanger = "border border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial";

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-light">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── Welcome ──────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Mis Solicitudes
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {stats.active > 0
                ? `${stats.active} activa${stats.active !== 1 ? "s" : ""}`
                : "Sin solicitudes activas"}
              {stats.pending > 0 && ` · ${stats.pending} esperando presupuesto`}
            </p>
          </div>
          <Link
            href="/dashboard/cliente/nueva-solicitud"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm shadow-primary/30"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva solicitud
          </Link>
        </div>

        {/* ── Stats ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Activas" value={String(stats.active)} detail={stats.pending > 0 ? `${stats.pending} pendientes` : "Al día"} detailColor={stats.pending > 0 ? "text-amber-600" : "text-emerald-600"} icon="pending_actions" iconBg="bg-blue-50" iconColor="text-primary" />
          <StatCard label="Completados" value={String(stats.completed)} detail="Total" icon="check_circle" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard label="Gastado" value={formatPrice(stats.spent)} detail="Servicios completados" icon="payments" iconBg="bg-purple-50" iconColor="text-purple-600" />
          <StatCard label="Guardados" value="5" detail="Ver lista" detailColor="text-primary" icon="favorite" iconBg="bg-orange-50" iconColor="text-orange-500" />
        </div>

        {/* ── Content Grid ─────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {([
                  { key: "active" as FilterTab, label: "Activas" },
                  { key: "all" as FilterTab, label: "Todas" },
                  { key: "completed" as FilterTab, label: "Historial" },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      filter === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <Link href="/dashboard/cliente/reservas" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                Ver todo
              </Link>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-14 text-center">
                <span className="material-symbols-outlined text-[40px] text-slate-300 mb-3">inbox</span>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {filter === "completed" ? "Sin historial todavía" : "Sin solicitudes activas"}
                </p>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Creá tu primera solicitud y recibí presupuestos de profesionales.</p>
                <Link href="/dashboard/cliente/nueva-solicitud" className={btnPrimary}>
                  <span className="material-symbols-outlined text-[16px]">add</span> Nueva solicitud
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((req) => {
                  const st = STATUS_MAP[req.status];
                  const provider = req.providerId ? PROVIDERS_MAP[req.providerId] : null;
                  const icon = CATEGORY_ICONS[req.serviceCategory] ?? "handyman";

                  return (
                    <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        {/* Category icon */}
                        <div className="flex items-center justify-center bg-slate-50 shrink-0 h-14 sm:h-auto sm:w-[72px] border-b sm:border-b-0 sm:border-r border-slate-100">
                          <span className="material-symbols-outlined text-slate-400 text-[24px]">{icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3.5 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">{req.serviceName}</h4>
                              <p className="text-xs text-slate-500">
                                {req.serviceCategory}
                                {req.proposals > 0 && req.status === "PENDING_QUOTE" && (
                                  <> · <span className="text-amber-600 font-medium">{req.proposals} propuestas</span></>
                                )}
                              </p>
                            </div>
                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0", badgeClass[st.color])}>
                              {st.label}
                            </span>
                          </div>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mb-2">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">calendar_today</span>
                              {formatDate(req.scheduledDate, req.scheduledTime)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">{provider ? "person" : req.proposals > 0 ? "group" : "person_search"}</span>
                              {provider ? provider.name : req.proposals > 0 ? `${req.proposals} propuestas` : "Sin asignar"}
                            </span>
                            {req.quotedPrice && (
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <span className="material-symbols-outlined text-[13px] text-slate-400">payments</span>
                                {formatPrice(req.quotedPrice)}
                              </span>
                            )}
                          </div>

                          {/* Progress */}
                          <div className="h-1 w-full rounded-full bg-slate-100">
                            <div className={cn("h-1 rounded-full transition-all", progressClass[st.color])} style={{ width: `${st.progress}%` }} />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-1.5 p-3 sm:p-3.5 sm:pl-0 sm:border-l sm:border-slate-100 sm:w-[120px] shrink-0 border-t sm:border-t-0 justify-end">
                          {req.status === "PENDING_QUOTE" && (
                            <>
                              {req.proposals > 0 && <button className={btnPrimary} onClick={() => nav("/dashboard/cliente/reservas")}>
                                <span className="material-symbols-outlined text-[13px]">visibility</span>Ver ({req.proposals})</button>}
                              <button className={btnDanger} onClick={() => setCancelId(req.id)}>
                                <span className="material-symbols-outlined text-[13px]">close</span>Cancelar</button>
                            </>
                          )}
                          {req.status === "QUOTED" && (
                            <>
                              <button className={btnPrimary} onClick={() => acceptQuote(req.id)}>
                                <span className="material-symbols-outlined text-[13px]">check</span>Aceptar</button>
                              <button className={btnOutline} onClick={() => nav("/dashboard/cliente/reservas")}>Detalle</button>
                            </>
                          )}
                          {(req.status === "ACCEPTED" || req.status === "CONFIRMED") && (
                            <>
                              <button className={btnPrimary} onClick={() => nav("/dashboard/cliente/mensajes")}>
                                <span className="material-symbols-outlined text-[13px]">chat</span>Mensaje</button>
                              <button className={btnOutline} onClick={() => nav("/dashboard/cliente/reservas")}>Reagendar</button>
                            </>
                          )}
                          {req.status === "IN_PROGRESS" && (
                            <>
                              <button className={btnOutline} onClick={() => nav("/dashboard/cliente/reservas")}>Detalles</button>
                              <button className={btnPrimary} onClick={() => nav("/dashboard/cliente/mensajes")}>
                                <span className="material-symbols-outlined text-[13px]">chat</span>Mensaje</button>
                            </>
                          )}
                          {req.status === "COMPLETED" && (
                            <>
                              <button className={btnPrimary} onClick={() => nav("/dashboard/cliente/reservas")}>
                                <span className="material-symbols-outlined text-[13px]">star</span>Calificar</button>
                              <button className={btnOutline} onClick={() => nav("/dashboard/cliente/nueva-solicitud")}>Repetir</button>
                            </>
                          )}
                          {req.status === "CANCELLED" && (
                            <button className={btnOutline} onClick={() => nav("/dashboard/cliente/nueva-solicitud")}>
                              <span className="material-symbols-outlined text-[13px]">add</span>Nueva</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar ────────────────────────── */}
          <div className="space-y-5">
            {/* Categories */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Categorías populares</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "plumbing", label: "Plomería", href: "/services/plomeria" },
                  { icon: "electrical_services", label: "Electricidad", href: "/services/electricidad" },
                  { icon: "yard", label: "Jardinería", href: "/services/jardineria" },
                  { icon: "cleaning_services", label: "Limpieza", href: "/services/limpieza" },
                ].map((cat) => (
                  <Link key={cat.label} href={cat.href} className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-primary/30 hover:bg-blue-50/60 transition-colors">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[22px]">{cat.icon}</span>
                    <span className="text-xs font-medium text-slate-700">{cat.label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/services" className="mt-3 flex w-full items-center justify-center rounded-lg border border-dashed border-slate-200 py-2 text-xs font-medium text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                Ver todas
              </Link>
            </div>

            {/* Providers */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Proveedores recientes</h3>
                <Link href="#" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">Ver todos</Link>
              </div>
              <div className="space-y-3">
                {[PROVIDERS_MAP.prov1, PROVIDERS_MAP.prov2, PROVIDERS_MAP.prov5].map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{p.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                        <div className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px] text-amber-500 fill-current">star</span>
                          <span className="text-[11px] text-slate-500">{p.rating} ({p.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo */}
            <div className="relative overflow-hidden rounded-xl gradient-primary p-5 text-white">
              <div className="relative z-10">
                <h3 className="font-bold text-sm mb-1">Invitá a un amigo</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-3">Obtené 20% de descuento en tu próximo servicio.</p>
                <button className="bg-white text-primary px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Invitar</button>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Cancel Modal ──────────────────────── */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-xl animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </span>
              <h3 className="text-base font-bold text-slate-900">Cancelar solicitud</h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">¿Estás seguro que querés cancelar?</p>
            <p className="text-sm font-semibold text-slate-800 mb-5 bg-slate-50 rounded-lg px-3 py-2">{cancelTarget.serviceName}</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 border border-slate-200 text-slate-700 rounded-lg py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Volver</button>
              <button onClick={confirmCancel} className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-600 transition-colors">Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   StatCard (local component)
   ═══════════════════════════════════════════════════════ */

function StatCard({ label, value, detail, detailColor = "text-slate-400", icon, iconBg, iconColor }: {
  label: string; value: string; detail: string; detailColor?: string;
  icon: string; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg, iconColor)}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </span>
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className={cn("text-[11px] font-medium mt-0.5", detailColor)}>{detail}</p>
    </div>
  );
}