"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="checkbox"
                className={cn(
                    "peer h-[44px] w-[44px] min-w-[44px] shrink-0 rounded-md border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary transition-all cursor-pointer appearance-none relative",
                    "after:content-[''] after:absolute after:inset-0 after:m-auto after:w-5 after:h-5 after:bg-[length:20px_20px] after:bg-center after:bg-no-repeat after:opacity-0 checked:after:opacity-100",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
