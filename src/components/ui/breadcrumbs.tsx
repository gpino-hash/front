import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]", className)}>
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={i} className="flex items-center gap-2">
                        {i > 0 && (
                            <span className="material-symbols-outlined text-slate-300 text-[12px]">chevron_right</span>
                        )}
                        {isLast || !item.href ? (
                            <span className={isLast ? "text-primary" : ""} aria-current={isLast ? "page" : undefined}>
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} className="hover:text-primary transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

export { Breadcrumbs };
