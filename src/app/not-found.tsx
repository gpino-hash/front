"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-light flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center pt-20">
                <Container className="text-center">
                    <div className="relative inline-block mb-12">
                        <span className="text-[180px] md:text-[240px] font-black text-primary/5 leading-none">404</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 bg-primary rounded-2xl shadow-2xl rotate-12 flex items-center justify-center text-white text-6xl md:text-8xl">
                                <span className="material-symbols-outlined text-[80px] md:text-[120px]">sentiment_dissatisfied</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Page not found</h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium">
                        The service you&apos;re looking for doesn&apos;t exist or has been moved to a new category.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/">
                            <Button className="h-14 px-8 rounded-xl text-lg gap-2">
                                <span className="material-symbols-outlined">home</span> Back to Home
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button variant="outline" className="h-14 px-8 rounded-xl text-lg gap-2">
                                Explore Services
                            </Button>
                        </Link>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
