"use client";

import { useMemo, type ReactNode } from "react";
import { ServiceProvider } from "@/services/ServiceContext";
import { createMockServices } from "@/services/registry";

export function AppProviders({ children }: { children: ReactNode }) {
    const services = useMemo(() => createMockServices(), []);

    return (
        <ServiceProvider services={services}>
            {children}
        </ServiceProvider>
    );
}
