"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const HOURS = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

interface Booking {
  id: string;
  clientName: string;
  service: string;
  day: number;
  startHour: number;
  duration: number;
  color: string;
}

const mockBookings: Booking[] = [
  { id: "b1", clientName: "Laura Giménez", service: "Instalación de ventilador", day: 0, startHour: 9, duration: 2, color: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200" },
  { id: "b2", clientName: "Mateo Rossi", service: "Revisión de tablero", day: 1, startHour: 14, duration: 1, color: "bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200" },
  { id: "b3", clientName: "Delfina Sosa", service: "Cableado estructurado", day: 2, startHour: 10, duration: 3, color: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200" },
  { id: "b4", clientName: "Pablo Méndez", service: "Reparación de circuitos", day: 4, startHour: 11, duration: 2, color: "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200" },
];

function getWeekDates(offset: number): Date[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function AgendaPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDates = getWeekDates(weekOffset);

  const formatDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  const monthLabel = weekDates[0].toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">Agenda</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset((p) => p - 1)}>
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </Button>
          <button
            onClick={() => setWeekOffset(0)}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 capitalize"
          >
            {monthLabel}
          </button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset((p) => p + 1)}>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </Button>
        </div>
      </div>

      {/* Upcoming bookings summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "event", label: "Esta semana", value: mockBookings.length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { icon: "schedule", label: "Horas reservadas", value: `${mockBookings.reduce((s, b) => s + b.duration, 0)}h`, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
          { icon: "event_available", label: "Próxima reserva", value: "Hoy 9:00", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <span className={`material-symbols-outlined text-xl ${stat.color}`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{stat.value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly calendar */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">calendar_month</span>
            Vista semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-200 dark:border-zinc-800">
                <div className="p-2" />
                {DAYS.map((day, i) => (
                  <div key={day} className="p-2 text-center border-l border-slate-200 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{day}</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{formatDate(weekDates[i])}</p>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {HOURS.map((hour, hi) => (
                <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-100 dark:border-zinc-800/50">
                  <div className="p-2 text-right">
                    <span className="text-[11px] text-zinc-400">{hour}</span>
                  </div>
                  {DAYS.map((_, di) => {
                    const booking = mockBookings.find(
                      (b) => b.day === di && b.startHour === hi + 8
                    );
                    return (
                      <div
                        key={di}
                        className="relative border-l border-slate-100 dark:border-zinc-800/50 min-h-[48px]"
                      >
                        {booking && (
                          <div
                            className={`absolute inset-x-1 top-1 rounded-lg border p-1.5 ${booking.color} z-10`}
                            style={{ height: `${booking.duration * 48 - 8}px` }}
                          >
                            <p className="text-[10px] font-bold truncate">{booking.service}</p>
                            <p className="text-[9px] opacity-70 truncate">{booking.clientName}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}