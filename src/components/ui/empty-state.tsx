import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateAction {
    label: string;
    href?: string;
    onClick?: () => void;
}

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: EmptyStateAction;
    className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200", className)}>
            {icon && (
                <span className="material-symbols-outlined text-[64px] text-slate-300 mb-6 block">
                    {icon}
                </span>
            )}
            <h3 className="text-2xl font-extrabold text-slate-950 mb-3">{title}</h3>
            {description && (
                <p className="text-slate-500 text-base font-medium max-w-md mx-auto leading-relaxed mb-8">
                    {description}
                </p>
            )}
            {action && (
                action.href ? (
                    <Link
                        href={action.href}
                        className="inline-flex px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md"
                    >
                        {action.label}
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md"
                    >
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}

export { EmptyState };
