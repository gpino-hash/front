"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    activeFilterCount?: number;
}

const DRAG_CLOSE_THRESHOLD = 100;

function MobileFilterDrawer({ isOpen, onClose, children, activeFilterCount = 0 }: MobileFilterDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef(0);
    const dragOffsetRef = useRef(0);
    const [dragOffset, setDragOffset] = useState(0);
    const isDragging = useRef(false);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
            return;
        }

        if (e.key === "Tab" && drawerRef.current) {
            const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
                'input, button, select, [tabindex]:not([tabindex="-1"])'
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
            setDragOffset(0);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "";
            };
        }
    }, [isOpen, handleKeyDown]);

    // Drag-to-close handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        dragStartY.current = e.touches[0].clientY;
        isDragging.current = true;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current) return;
        const offset = Math.max(0, e.touches[0].clientY - dragStartY.current);
        dragOffsetRef.current = offset;
        setDragOffset(offset);
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
        if (dragOffsetRef.current > DRAG_CLOSE_THRESHOLD) {
            onClose();
        }
        dragOffsetRef.current = 0;
        setDragOffset(0);
    }, [onClose]);

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
                aria-label="Filtros"
                style={{ transform: isOpen ? `translateY(${dragOffset}px)` : undefined }}
                className={cn(
                    "fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col",
                    isOpen
                        ? dragOffset > 0 ? "" : "transition-transform duration-300 ease-out"
                        : "transition-transform duration-300 ease-out translate-y-full"
                )}
            >
                {/* Sticky header: handle + title */}
                <div
                    className="flex-shrink-0 touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2 cursor-grab">
                        <div className="w-10 h-1 bg-slate-200 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-900">Configurá tus filtros</h2>
                            {activeFilterCount > 0 && (
                                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        <IconButton icon="close" label="Cerrar filtros" size="md" variant="ghost" onClick={onClose} />
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                    {children}

                    <button
                        onClick={onClose}
                        className="w-full mt-8 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors shadow-md active:scale-[0.98]"
                    >
                        Mostrar resultados
                    </button>
                </div>
            </div>
        </>
    );
}

function MobileFilterTrigger({ activeFilterCount, onClick }: { activeFilterCount: number; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-dark text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 font-bold transition-all active:scale-95"
        >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            Filtros
            {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-primary bg-white rounded-full">
                    {activeFilterCount}
                </span>
            )}
        </button>
    );
}

export { MobileFilterDrawer, MobileFilterTrigger };
