import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    variant?: "light" | "dark";
    className?: string;
}

const sizeClasses = {
    sm: { icon: "size-7", text: "text-xl" },
    md: { icon: "size-9", text: "text-2xl" },
    lg: { icon: "size-12", text: "text-3xl" },
};

function Logo({ size = "md", variant = "dark", className }: LogoProps) {
    const s = sizeClasses[size];
    const isDark = variant === "dark";

    return (
        <Link
            href="/"
            className={cn(
                "flex-shrink-0 flex items-center gap-2.5 group px-1 focus-visible:outline-none",
                className
            )}
        >
            {/* Animated Icon Mark */}
            <div
                className={cn(
                    s.icon,
                    "relative flex items-center justify-center rounded-[10px] transition-all duration-500",
                    "group-hover:scale-110 group-hover:rotate-[-6deg]",
                    isDark
                        ? "bg-primary shadow-[0_4px_14px_rgba(15,98,254,0.35)]"
                        : "bg-white/15 backdrop-blur-sm border border-white/20"
                )}
            >
                {/* Shine sweep on hover */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-[10px] overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    )}
                >
                    <div className="absolute inset-0 gradient-shine animate-shimmer" />
                </div>

                <svg
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[60%] h-[60%] relative z-10"
                >
                    {/* Top-left block */}
                    <rect x="3" y="3" width="9" height="9" rx="2.5" fill="white" fillOpacity="1" />
                    {/* Bottom-right block */}
                    <rect x="16" y="16" width="9" height="9" rx="2.5" fill="white" fillOpacity="1" />
                    {/* Center connecting diamond */}
                    <rect
                        x="9.5" y="9.5"
                        width="9" height="9"
                        rx="2"
                        fill="white"
                        fillOpacity="0.5"
                        transform="rotate(0 14 14)"
                    />
                </svg>
            </div>

            {/* Wordmark */}
            <span
                className={cn(
                    s.text,
                    "font-black tracking-tighter transition-all duration-300",
                    isDark
                        ? "text-slate-900 group-hover:text-primary"
                        : "text-white"
                )}
            >
                Profesio
            </span>
        </Link>
    );
}

export { Logo };
