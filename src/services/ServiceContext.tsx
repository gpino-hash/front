"use client";

import { createContext, useContext, type ReactNode } from "react";
import { IProviderService, IReviewService, ICategoryService } from "./types";

export interface ServiceRegistry {
    providerService: IProviderService;
    reviewService: IReviewService;
    categoryService: ICategoryService;
}

const ServiceContext = createContext<ServiceRegistry | null>(null);

export function ServiceProvider({
    services,
    children,
}: {
    services: ServiceRegistry;
    children: ReactNode;
}) {
    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useServices(): ServiceRegistry {
    const ctx = useContext(ServiceContext);
    if (!ctx) {
        throw new Error("useServices must be used within a ServiceProvider");
    }
    return ctx;
}
