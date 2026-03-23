/* ── Types ──────────────────────────────────────────── */

export type RequestStatus =
  | "PENDING_QUOTE"
  | "QUOTED"
  | "ACCEPTED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface ServiceRequest {
  id: string;
  status: RequestStatus;
  serviceName: string;
  serviceCategory: string;
  providerId: string | null;
  quotedPrice: number | null;
  scheduledDate: string;
  scheduledTime: string;
  proposals: number;
  createdAt: string;
}

export interface StatusDisplay {
  label: string;
  color: "blue" | "amber" | "purple" | "emerald" | "red" | "orange";
  progress: number;
}

export interface RecentProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
}

/* ── Constants ─────────────────────────────────────── */

export const STATUS_MAP: Record<RequestStatus, StatusDisplay> = {
  PENDING_QUOTE: { label: "Esperando presupuesto", color: "amber",   progress: 15 },
  QUOTED:        { label: "Presupuesto recibido",  color: "purple",  progress: 30 },
  ACCEPTED:      { label: "Aceptado",              color: "blue",    progress: 45 },
  CONFIRMED:     { label: "Confirmado",            color: "blue",    progress: 55 },
  IN_PROGRESS:   { label: "En progreso",           color: "orange",  progress: 75 },
  COMPLETED:     { label: "Completado",            color: "emerald", progress: 100 },
  CANCELLED:     { label: "Cancelado",             color: "red",     progress: 0 },
};

export const CATEGORY_ICONS: Record<string, string> = {
  Plomería: "plumbing",
  Electricidad: "electrical_services",
  Climatización: "ac_unit",
  Limpieza: "cleaning_services",
  Pintura: "format_paint",
  Carpintería: "carpenter",
  Jardinería: "yard",
};

export const ACTIVE_STATUSES: RequestStatus[] = [
  "PENDING_QUOTE", "QUOTED", "ACCEPTED", "CONFIRMED", "IN_PROGRESS",
];

export const PROVIDERS_MAP: Record<string, RecentProvider> = {
  prov1: { id: "prov1", name: "Carlos M.", rating: 4.8, reviews: 120 },
  prov2: { id: "prov2", name: "Laura S.", rating: 5.0, reviews: 85 },
  prov3: { id: "prov3", name: "TechFix Co.", rating: 4.6, reviews: 64 },
  prov4: { id: "prov4", name: "Miguel T.", rating: 4.9, reviews: 42 },
  prov5: { id: "prov5", name: "Ana R.", rating: 4.7, reviews: 93 },
};

/* ── Helpers ───────────────────────────────────────── */

function daysFromNow(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(dateStr: string, time: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const t = time.slice(0, 5);
  if (date.getTime() === today.getTime()) return `Hoy, ${t}`;
  if (date.getTime() === tomorrow.getTime()) return `Mañana, ${t}`;
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${date.getDate()} ${months[date.getMonth()]}, ${t}`;
}

/* ── Mock Data ─────────────────────────────────────── */

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: "bk-001", status: "IN_PROGRESS",
    serviceName: "Reparación canilla cocina", serviceCategory: "Plomería",
    providerId: "prov1", quotedPrice: 15000, proposals: 0,
    scheduledDate: daysFromNow(0), scheduledTime: "14:00", createdAt: daysFromNow(-5),
  },
  {
    id: "bk-002", status: "PENDING_QUOTE",
    serviceName: "Cableado living comedor", serviceCategory: "Electricidad",
    providerId: null, quotedPrice: null, proposals: 3,
    scheduledDate: daysFromNow(1), scheduledTime: "09:00", createdAt: daysFromNow(-2),
  },
  {
    id: "bk-003", status: "CONFIRMED",
    serviceName: "Service aire acondicionado", serviceCategory: "Climatización",
    providerId: "prov3", quotedPrice: 25000, proposals: 0,
    scheduledDate: daysFromNow(3), scheduledTime: "10:00", createdAt: daysFromNow(-4),
  },
  {
    id: "bk-004", status: "QUOTED",
    serviceName: "Pintura dormitorio principal", serviceCategory: "Pintura",
    providerId: "prov2", quotedPrice: 45000, proposals: 0,
    scheduledDate: daysFromNow(5), scheduledTime: "08:00", createdAt: daysFromNow(-3),
  },
  {
    id: "bk-005", status: "COMPLETED",
    serviceName: "Limpieza profunda depto", serviceCategory: "Limpieza",
    providerId: "prov5", quotedPrice: 22000, proposals: 0,
    scheduledDate: daysFromNow(-7), scheduledTime: "09:00", createdAt: daysFromNow(-12),
  },
  {
    id: "bk-006", status: "COMPLETED",
    serviceName: "Destape cañería baño", serviceCategory: "Plomería",
    providerId: "prov1", quotedPrice: 12000, proposals: 0,
    scheduledDate: daysFromNow(-14), scheduledTime: "16:00", createdAt: daysFromNow(-16),
  },
  {
    id: "bk-007", status: "COMPLETED",
    serviceName: "Estantes flotantes living", serviceCategory: "Carpintería",
    providerId: "prov4", quotedPrice: 18000, proposals: 0,
    scheduledDate: daysFromNow(-21), scheduledTime: "10:00", createdAt: daysFromNow(-25),
  },
];