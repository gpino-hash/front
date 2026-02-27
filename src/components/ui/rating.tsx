import * as React from "react";
import { cn } from "@/lib/utils";

interface RatingProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
    onChange?: (value: number) => void;
    readonly?: boolean;
}

const Rating = ({
    value,
    max = 5,
    size = "md",
    className,
    onChange,
    readonly = true,
}: RatingProps) => {
    const [hover, setHover] = React.useState(0);
    const [focusedIndex, setFocusedIndex] = React.useState(-1);

    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-2xl",
    };

    const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
        if (readonly) return;

        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                e.preventDefault();
                if (starValue < max) {
                    onChange?.(starValue + 1);
                    setFocusedIndex(starValue); // next star (0-indexed)
                }
                break;
            case "ArrowLeft":
            case "ArrowDown":
                e.preventDefault();
                if (starValue > 1) {
                    onChange?.(starValue - 1);
                    setFocusedIndex(starValue - 2); // prev star (0-indexed)
                }
                break;
            case "Home":
                e.preventDefault();
                onChange?.(1);
                setFocusedIndex(0);
                break;
            case "End":
                e.preventDefault();
                onChange?.(max);
                setFocusedIndex(max - 1);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                onChange?.(starValue);
                break;
        }
    };

    const starsRef = React.useRef<(HTMLSpanElement | null)[]>([]);

    React.useEffect(() => {
        if (focusedIndex >= 0 && focusedIndex < max) {
            starsRef.current[focusedIndex]?.focus();
        }
    }, [focusedIndex, max]);

    return (
        <div
            className={cn("flex items-center gap-0.5", className)}
            role="group"
            aria-label={readonly ? `Rating: ${value} out of ${max} stars` : `Rate: ${value} out of ${max} stars`}
        >
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                const isActive = starValue <= (hover || value);

                return (
                    <span
                        key={i}
                        ref={(el) => { starsRef.current[i] = el; }}
                        role={readonly ? "presentation" : "radio"}
                        aria-checked={!readonly ? starValue === Math.round(value) : undefined}
                        aria-label={!readonly ? `${starValue} star${starValue > 1 ? "s" : ""}` : undefined}
                        tabIndex={!readonly ? (starValue === Math.round(value) || (value === 0 && i === 0) ? 0 : -1) : undefined}
                        className={cn(
                            "material-symbols-outlined select-none",
                            sizeClasses[size],
                            isActive ? "text-amber-400" : "text-zinc-200",
                            !readonly && "cursor-pointer transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm"
                        )}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        onClick={() => !readonly && onChange?.(starValue)}
                        onMouseEnter={() => !readonly && setHover(starValue)}
                        onMouseLeave={() => !readonly && setHover(0)}
                        onKeyDown={(e) => handleKeyDown(e, starValue)}
                    >
                        star
                    </span>
                );
            })}
        </div>
    );
};

export { Rating };
