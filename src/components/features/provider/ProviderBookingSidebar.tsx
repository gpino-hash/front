"use client";

import { useState, useMemo } from "react";
import { Provider } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProviderBookingSidebarProps {
    provider: Provider;
}

/**
 * Parses the latest closing hour from provider availability.
 * E.g. "09:00 - 18:00" → 18, "Las 24hs" → 24
 */
function getLatestClosingHour(availability: { day: string; hours: string }[]): number {
    let latest = 0;
    for (const slot of availability) {
        const hours = slot.hours.trim();
        if (hours.toLowerCase().includes("24")) return 24;
        const match = hours.match(/(\d{1,2}):(\d{2})\s*$/);
        if (match) {
            latest = Math.max(latest, parseInt(match[1], 10));
        }
    }
    return latest || 24;
}

function getMinDate(closingHour: number): string {
    const now = new Date();
    const currentHour = now.getHours();
    // If current hour >= closing hour, provider is done for today → start tomorrow
    if (currentHour >= closingHour) {
        now.setDate(now.getDate() + 1);
    }
    return now.toISOString().split("T")[0];
}

function generateTimeSlots(availability: { day: string; hours: string }[]): string[] {
    // Try to parse the first availability entry for start/end hours
    for (const slot of availability) {
        const hours = slot.hours.trim();
        if (hours.toLowerCase().includes("24")) {
            return ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
        }
        const match = hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        if (match) {
            const start = parseInt(match[1], 10);
            const end = parseInt(match[3], 10);
            const slots: string[] = [];
            for (let h = start; h < end; h += 2) {
                slots.push(`${String(h).padStart(2, "0")}:00`);
            }
            return slots.length > 0 ? slots : ["09:00", "11:00", "14:00", "16:00"];
        }
    }
    return ["09:00", "11:00", "14:00", "16:00"];
}

export function ProviderBookingSidebar({ provider }: ProviderBookingSidebarProps) {
    const closingHour = useMemo(() => getLatestClosingHour(provider.availability), [provider.availability]);
    const minDate = useMemo(() => getMinDate(closingHour), [closingHour]);
    const timeSlots = useMemo(() => generateTimeSlots(provider.availability), [provider.availability]);

    const [selectedDate, setSelectedDate] = useState(minDate);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const serviceFee = 1500;
    const basePrice = provider.pricePerHour;

    // Filter out past time slots if selected date is today
    const today = new Date().toISOString().split("T")[0];
    const currentHour = new Date().getHours();
    const availableSlots = selectedDate === today
        ? timeSlots.filter((t) => parseInt(t.split(":")[0], 10) > currentHour)
        : timeSlots;

    return (
        <aside className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Price */}
            <div className="space-y-1">
                <p className="text-slate-500 text-sm uppercase font-bold tracking-tight">Desde</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{formatPrice(basePrice)}</span>
                    <span className="text-slate-500 text-sm">/ hora</span>
                </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Elegir fecha</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                        <input
                            type="date"
                            min={minDate}
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime(null);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Elegir horario</label>
                    {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {availableSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2.5 text-xs font-medium rounded-xl border transition-all ${
                                        selectedTime === time
                                            ? "border-primary bg-primary/10 text-primary font-bold"
                                            : "border-slate-200 hover:border-primary hover:text-primary"
                                    }`}
                                >
                                    {time} hs
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 py-2">No hay horarios disponibles para esta fecha.</p>
                    )}
                </div>
            </div>

            {/* Price Summary */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Fee del servicio</span>
                    <span className="text-slate-900 font-medium">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-black">
                    <span className="text-slate-900">Total est.</span>
                    <span className="text-primary">{formatPrice(basePrice + serviceFee)}</span>
                </div>
            </div>

            {/* Book CTA */}
            <button
                disabled={!selectedTime}
                className="w-full py-4 bg-primary text-white font-black text-lg rounded-xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Reservar ahora
            </button>

            <p className="text-center text-xs text-slate-400">
                No se te cobrara aun. El presupuesto final se brinda tras la evaluacion.
            </p>
        </aside>
    );
}
