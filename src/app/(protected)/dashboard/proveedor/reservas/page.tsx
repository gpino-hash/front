"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";

type BookingStatus = "UPCOMING" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS";

interface MockBooking {
  id: string;
  clientName: string;
  clientInitials: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: string }> = {
  UPCOMING: { label: "Próxima", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", icon: "schedule" },
  IN_PROGRESS: { label: "En curso", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", icon: "hourglass_top" },
  COMPLETED: { label: "Completada", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: "check_circle" },
  CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", icon: "cancel" },
};

const tabs = [
  { key: "ALL", label: "Todas" },
  { key: "UPCOMING", label: "Próximas" },
  { key: "COMPLETED", label: "Completadas" },
  { key: "CANCELLED", label: "Canceladas" },
] as const;

const mockBookings: MockBooking[] = [
  { id: "bk1", clientName: "Laura Giménez", clientInitials: "LG", service: "Instalación de ventilador", date: "2026-04-03", time: "09:00 - 11:00", status: "UPCOMING", price: 8500 },
  { id: "bk2", clientName: "Mateo Rossi", clientInitials: "MR", service: "Revisión de tablero eléctrico", date: "2026-04-04", time: "14:00 - 15:30", status: "UPCOMING", price: 12000 },
  { id: "bk3", clientName: "Delfina Sosa", clientInitials: "DS", service: "Cableado estructurado", date: "2026-04-02", time: "10:00 - 13:00", status: "IN_PROGRESS", price: 28000 },
  { id: "bk4", clientName: "Pablo Méndez", clientInitials: "PM", service: "Instalación de luces LED", date: "2026-03-28", time: "16:00 - 18:00", status: "COMPLETED", price: 15000 },
  { id: "bk5", clientName: "Carla Fernández", clientInitials: "CF", service: "Reparación de circuitos", date: "2026-03-25", time: "09:00 - 11:00", status: "COMPLETED", price: 11000 },
  { id: "bk6", clientName: "Andrés Torres", clientInitials: "AT", service: "Instalación de enchufes", date: "2026-03-20", time: "11:00 - 12:00", status: "CANCELLED", price: 6500 },
];

export default function ReservasPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const filtered = activeTab === "ALL" ? mockBookings : mockBookings.filter((b) => b.status === activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Reservas</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab.key
                ? "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-4 block">book_online</span>
          <p className="text-sm text-zinc-500">No hay reservas en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const config = statusConfig[booking.status];
            return (
              <Card key={booking.id} className="border-0 shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {booking.clientInitials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                        {booking.clientName}
                      </h3>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", config.color)}>
                        <span className="material-symbols-outlined text-[12px]">{config.icon}</span>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{booking.service}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {new Date(booking.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {booking.time}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{formatPrice(booking.price)}</p>
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