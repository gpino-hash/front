import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
    accent?: boolean;
}

function SectionHeader({ title, subtitle, action, className, accent }: SectionHeaderProps) {
    return (
        <div className={cn("flex justify-between items-end mb-6", className)}>
            <div>
                {accent && (
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-0.5 w-5 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">
                            Destacados
                        </span>
                    </div>
                )}
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">{subtitle}</p>
                )}
            </div>
            {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </div>
    );
}

export { SectionHeader };
