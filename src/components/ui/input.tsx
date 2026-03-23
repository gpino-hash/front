import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, id: providedId, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = providedId || generatedId;
        const errorId = error ? `${inputId}-error` : undefined;
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        type={isPassword ? (showPassword ? "text" : "password") : type}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={errorId}
                        className={cn(
                            "flex h-12 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-900 dark:text-white ring-offset-white dark:ring-offset-slate-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all",
                            icon && "pl-11",
                            isPassword && "pr-11",
                            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {showPassword ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    )}
                </div>
                {error && (
                    <p id={errorId} role="alert" className="text-[11px] font-medium text-red-500 ml-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
