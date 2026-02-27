import { Category } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    category: Category;
    className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
    return (
        <Link href={`/services/${category.slug}`} className="block h-full group">
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-8 text-center cursor-pointer h-full transition-all duration-300 bg-white border border-border-light rounded-2xl overflow-hidden relative",
                    "hover:shadow-card-hover hover:-translate-y-1 group-hover:border-primary/20",
                    className
                )}
            >
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-primary mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-[32px]">{category.icon}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    {category.providerCount} Experts
                </p>
            </div>
        </Link>
    );
}
