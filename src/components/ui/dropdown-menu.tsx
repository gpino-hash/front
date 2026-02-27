"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: "left" | "right";
    className?: string;
}

function DropdownMenu({ trigger, children, align = "right", className }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                close();
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open, close]);

    return (
        <div ref={menuRef} className="relative">
            <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>
            {open && (
                <div
                    className={cn(
                        "absolute top-full mt-2 z-[80] min-w-[200px] bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 animate-fade-in",
                        align === "right" ? "right-0" : "left-0",
                        className
                    )}
                    role="menu"
                >
                    {typeof children === "function" ? (children as (close: () => void) => ReactNode)(close) : children}
                </div>
            )}
        </div>
    );
}

interface DropdownItemProps {
    icon?: string;
    label: string;
    description?: string;
    active?: boolean;
    onClick?: () => void;
    href?: string;
    className?: string;
}

function DropdownItem({ icon, label, description, active, onClick, className }: DropdownItemProps) {
    return (
        <button
            role="menuitem"
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150",
                "hover:bg-slate-50 active:bg-slate-100",
                active && "bg-primary-subtle",
                className
            )}
        >
            {icon && (
                <span className={cn(
                    "material-symbols-outlined text-[18px]",
                    active ? "text-primary" : "text-slate-400"
                )}>
                    {icon}
                </span>
            )}
            <div className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm font-semibold truncate",
                    active ? "text-primary" : "text-slate-700"
                )}>
                    {label}
                </p>
                {description && (
                    <p className="text-[11px] text-slate-400 truncate">{description}</p>
                )}
            </div>
            {active && (
                <span className="material-symbols-outlined text-primary text-[16px]">check</span>
            )}
        </button>
    );
}

function DropdownDivider() {
    return <div className="my-1.5 border-t border-slate-100" />;
}

export { DropdownMenu, DropdownItem, DropdownDivider };