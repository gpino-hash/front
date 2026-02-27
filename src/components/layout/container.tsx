import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    maxW?: "7xl" | "5xl" | "3xl" | "full";
}

export function Container({
    children,
    className,
    maxW = "7xl",
    ...props
}: ContainerProps) {
    const maxWidthClasses = {
        "7xl": "max-w-7xl",
        "5xl": "max-w-5xl",
        "3xl": "max-w-3xl",
        "full": "max-w-full",
    };

    return (
        <div
            className={cn(
                "mx-auto px-4 md:px-6 lg:px-8",
                maxWidthClasses[maxW],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
