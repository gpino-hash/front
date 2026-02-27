import * as React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    label: string;
    size?: "sm" | "md" | "lg";
    variant?: "ghost" | "outline" | "filled";
}

const sizeClasses = {
    sm: "p-1.5 text-[16px]",
    md: "p-2 text-[20px]",
    lg: "p-3 text-[24px]",
};

const variantClasses = {
    ghost: "hover:bg-slate-100 text-slate-600",
    outline: "border border-border-light hover:bg-slate-50 text-slate-600",
    filled: "bg-primary text-white hover:bg-primary-dark shadow-md",
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, label, size = "md", variant = "ghost", className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                aria-label={label}
                className={cn(
                    "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                <span className={cn("material-symbols-outlined", `text-[${size === "sm" ? "16" : size === "md" ? "20" : "24"}px]`)}>
                    {icon}
                </span>
            </button>
        );
    }
);
IconButton.displayName = "IconButton";

export { IconButton };
