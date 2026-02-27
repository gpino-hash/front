import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    initials: string;
    gradient: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, initials, gradient, size = "md", ...props }, ref) => {
        const sizeClasses = {
            sm: "h-8 w-8 text-[10px]",
            md: "h-12 w-12 text-sm",
            lg: "h-16 w-16 text-lg",
            xl: "h-24 w-24 text-2xl",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl font-bold text-white shadow-sm",
                    sizeClasses[size],
                    gradient,
                    className
                )}
                {...props}
            >
                {initials}
            </div>
        );
    }
);
Avatar.displayName = "Avatar";

export { Avatar };
