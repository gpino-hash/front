import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
    {
        variants: {
            variant: {
                success: "bg-green-50 text-green-700 ring-1 ring-green-500/20",
                warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
                danger: "bg-red-50 text-red-700 ring-1 ring-red-500/20",
                info: "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20",
                neutral: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
            },
        },
        defaultVariants: {
            variant: "neutral",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };