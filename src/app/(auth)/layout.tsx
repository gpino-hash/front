"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            {/* Theme Toggle - fixed top right on all auth pages */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {children}
        </div>
    );
}