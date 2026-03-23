"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { ProviderGallery } from "@/components/features/provider/ProviderGallery";
import { ProviderProfileCard } from "@/components/features/provider/ProviderProfileCard";
import { ProviderDescription } from "@/components/features/provider/ProviderDescription";
import { ProviderPackagesTable } from "@/components/features/provider/ProviderPackagesTable";
import { ProviderReviewsList } from "@/components/features/provider/ProviderReviewsList";
import { ProviderBookingSidebar } from "@/components/features/provider/ProviderBookingSidebar";
import { ProviderOtherServices } from "@/components/features/provider/ProviderOtherServices";
import { Rating } from "@/components/ui/rating";

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { provider, reviews, isLoading, error } = useProviderProfile(id);

    if (error) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl font-bold text-red-500 mb-2">Ocurrio un error</p>
                        <p className="text-zinc-500">{error.message}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col">
                <Header />
                <main className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8">
                    <ProviderPageSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-bold text-zinc-500">Taskaonal no encontrado</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light">
            <Header />

            <main className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column — Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header: Breadcrumbs + Title + Rating */}
                        <section className="space-y-4">
                            <Breadcrumbs
                                items={[
                                    { label: "Inicio", href: "/" },
                                    { label: provider.category, href: "/services" },
                                    { label: provider.name },
                                ]}
                            />
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {provider.name} — {provider.specialty}
                            </h1>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center text-amber-500">
                                    <Rating value={provider.rating} size="sm" />
                                    <span className="ml-2 font-bold text-slate-900">{provider.rating}</span>
                                    <span className="ml-1 text-slate-500">({provider.reviewCount} resenas)</span>
                                </div>
                                {provider.isVerified && (
                                    <>
                                        <span className="text-slate-300">|</span>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <span className="material-symbols-outlined text-base text-primary">verified</span>
                                            <span>Identidad verificada</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Photo Gallery */}
                        <ProviderGallery provider={provider} />

                        {/* Provider Profile Card */}
                        <ProviderProfileCard provider={provider} />

                        {/* Service Description */}
                        <ProviderDescription provider={provider} />

                        {/* Service Packages Table */}
                        <ProviderPackagesTable services={provider.services} />

                        {/* Reviews */}
                        <ProviderReviewsList
                            reviews={reviews}
                            providerRating={provider.rating}
                            providerReviewCount={provider.reviewCount}
                        />
                    </div>

                    {/* Right Column — Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <ProviderBookingSidebar provider={provider} />
                            <ProviderOtherServices provider={provider} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

/* ========================= */
/* Page Skeleton              */
/* ========================= */

function ProviderPageSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-16">
            <div className="lg:col-span-2 space-y-8">
                {/* Title skeleton */}
                <div className="space-y-4">
                    <div className="skeleton-linkedin h-4 bg-[#E2E5E9] rounded w-48 overflow-hidden" />
                    <div className="skeleton-linkedin h-10 bg-[#E2E5E9] rounded w-3/4 overflow-hidden" />
                    <div className="skeleton-linkedin h-5 bg-[#E2E5E9] rounded w-56 overflow-hidden" />
                </div>
                {/* Gallery skeleton */}
                <div className="skeleton-linkedin grid grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[450px] overflow-hidden">
                    <div className="col-span-4 md:col-span-3 row-span-2 bg-[#E2E5E9] rounded-xl" />
                    <div className="hidden md:block col-span-1 row-span-1 bg-[#E2E5E9] rounded-xl" />
                    <div className="hidden md:block col-span-1 row-span-1 bg-[#E2E5E9] rounded-xl" />
                </div>
                {/* Profile card skeleton */}
                <div className="skeleton-linkedin p-6 bg-white rounded-xl border border-[#E8EAED] flex items-center gap-4 overflow-hidden">
                    <div className="size-16 rounded-full bg-[#E2E5E9]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 bg-[#E2E5E9] rounded w-48" />
                        <div className="h-4 bg-[#E2E5E9] rounded w-72" />
                    </div>
                </div>
                {/* Description skeleton */}
                <div className="skeleton-linkedin space-y-3 overflow-hidden">
                    <div className="h-7 bg-[#E2E5E9] rounded w-52" />
                    <div className="h-4 bg-[#E2E5E9] rounded w-full" />
                    <div className="h-4 bg-[#E2E5E9] rounded w-[90%]" />
                    <div className="h-4 bg-[#E2E5E9] rounded w-3/4" />
                </div>
                {/* Table skeleton */}
                <div className="skeleton-linkedin space-y-3 overflow-hidden">
                    <div className="h-7 bg-[#E2E5E9] rounded w-44" />
                    <div className="h-48 bg-[#E2E5E9] rounded-xl" />
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="skeleton-linkedin bg-white rounded-xl border border-[#E8EAED] p-6 space-y-4 overflow-hidden">
                    <div className="h-4 bg-[#E2E5E9] rounded w-24" />
                    <div className="h-8 bg-[#E2E5E9] rounded w-32" />
                    <div className="h-10 bg-[#E2E5E9] rounded w-full" />
                    <div className="h-10 bg-[#E2E5E9] rounded w-full" />
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-10 bg-[#E2E5E9] rounded" />
                        <div className="h-10 bg-[#E2E5E9] rounded" />
                        <div className="h-10 bg-[#E2E5E9] rounded" />
                        <div className="h-10 bg-[#E2E5E9] rounded" />
                    </div>
                    <div className="h-14 bg-[#E2E5E9] rounded-xl" />
                </div>
            </div>
        </div>
    );
}
