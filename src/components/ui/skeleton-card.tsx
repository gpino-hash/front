import { cn } from "@/lib/utils";

interface SkeletonCardProps {
    variant?: "provider" | "category";
    className?: string;
}

function SkeletonCard({ variant = "provider", className }: SkeletonCardProps) {
    if (variant === "category") {
        return (
            <div className={cn("skeleton-linkedin relative h-64 bg-white border border-[#E8EAED] rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden", className)}>
                <div className="w-16 h-16 bg-[#E2E5E9] rounded-xl mb-6" />
                <div className="h-5 bg-[#E2E5E9] rounded w-24 mb-2" />
                <div className="h-3 bg-[#E2E5E9] rounded w-16" />
            </div>
        );
    }

    return (
        <div className={cn("skeleton-linkedin relative bg-white rounded-3xl border border-[#E8EAED] overflow-hidden flex flex-col h-full", className)}>
            {/* Image area */}
            <div className="aspect-[4/3] bg-[#E2E5E9]" />

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#E2E5E9] flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#E2E5E9] rounded-sm w-3/4" />
                        <div className="h-3 bg-[#E2E5E9] rounded-sm w-1/2" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2.5 mb-5">
                    <div className="h-3 bg-[#E2E5E9] rounded-sm w-full" />
                    <div className="h-3 bg-[#E2E5E9] rounded-sm w-[90%]" />
                    <div className="h-3 bg-[#E2E5E9] rounded-sm w-3/5" />
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-[#E8EAED]">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-2.5 bg-[#E2E5E9] rounded-sm w-12" />
                            <div className="h-6 bg-[#E2E5E9] rounded-sm w-20" />
                        </div>
                        <div className="h-10 bg-[#E2E5E9] rounded-2xl w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { SkeletonCard };