"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

interface MobileSearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    serviceQuery: string;
    locationQuery: string;
    onServiceChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onSearch?: () => void;
}

function MobileSearchDrawer({
    isOpen,
    onClose,
    serviceQuery,
    locationQuery,
    onServiceChange,
    onLocationChange,
    onSearch,
}: MobileSearchDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
            return;
        }

        // Focus trap
        if (e.key === "Tab" && drawerRef.current) {
            const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
                'input, button, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
            // Focus first input after transition
            const timer = setTimeout(() => firstInputRef.current?.focus(), 150);
            return () => {
                clearTimeout(timer);
                document.removeEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "";
            };
        }
    }, [isOpen, handleKeyDown]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Search"
                className={cn(
                    "fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto",
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-slate-200 rounded-full" />
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Search</h2>
                        <IconButton
                            ref={closeButtonRef}
                            icon="close"
                            label="Close search"
                            size="md"
                            variant="ghost"
                            onClick={onClose}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="mobile-service" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                Service
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">search</span>
                                <input
                                    ref={firstInputRef}
                                    id="mobile-service"
                                    type="text"
                                    placeholder="What help do you need?"
                                    value={serviceQuery}
                                    onChange={(e) => onServiceChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mobile-location" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                Where
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">location_on</span>
                                <input
                                    id="mobile-location"
                                    type="text"
                                    placeholder="Mexico City"
                                    value={locationQuery}
                                    onChange={(e) => onLocationChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">search</span>
                        Search
                    </button>
                </form>
            </div>
        </>
    );
}

export { MobileSearchDrawer };
