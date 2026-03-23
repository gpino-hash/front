"use client";

import { useMemo, type ReactNode } from "react";
import { ServiceProvider } from "@/services/ServiceContext";
import { createMockServices } from "@/services/registry";
import { AuthProvider } from "@/lib/auth/auth-context";

export function AppProviders({ children }: { children: ReactNode }) {
    const services = useMemo(() => createMockServices(), []);

    return (
        <AuthProvider>
            <ServiceProvider services={services}>
                {children}
            </ServiceProvider>
        </AuthProvider>
    );
}
