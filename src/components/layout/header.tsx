"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { SearchBar } from "@/components/shared/search-bar";
import { MobileSearchDrawer } from "@/components/shared/mobile-search-drawer";
import { IconButton } from "@/components/ui/icon-button";
import { DropdownMenu, DropdownItem, DropdownDivider } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const languages = [
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
];

export function Header() {
    const [serviceQuery, setServiceQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [heroSearchVisible, setHeroSearchVisible] = useState(true);
    const [currentLang, setCurrentLang] = useState("es");
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isProviderDetail = pathname.startsWith("/providers/");

    // Track header background style
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Observe when the hero search bar leaves the viewport
    useEffect(() => {
        if (isProviderDetail) {
            setHeroSearchVisible(true);
            return;
        }
        if (!isHome) {
            setHeroSearchVisible(false);
            return;
        }
        setHeroSearchVisible(true);
        const heroSearch = document.getElementById("hero-search");
        if (!heroSearch) return;
        const observer = new IntersectionObserver(
            ([entry]) => setHeroSearchVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(heroSearch);
        return () => observer.disconnect();
    }, [isHome]);

    return (
        <>
            <motion.header
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-400",
                    // On scroll → solid bar full-width
                    scrolled
                        ? "bg-white/95 backdrop-blur-2xl border-b border-slate-200/70 shadow-[0_1px_24px_rgba(0,0,0,0.07)]"
                        : "bg-white/80 backdrop-blur-xl border-b border-white/10"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-18 gap-6">

                    {/* ── Logo ── */}
                    <Logo className="flex-shrink-0" />

                    {/* ── Search Bar – desktop only ── */}
                    <div className={cn(
                        "hidden md:flex flex-1 max-w-xl lg:max-w-2xl transition-all duration-300",
                        heroSearchVisible ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
                    )}>
                        <SearchBar
                            serviceQuery={serviceQuery}
                            locationQuery={locationQuery}
                            onServiceChange={setServiceQuery}
                            onLocationChange={setLocationQuery}
                        />
                    </div>

                    {/* ── Right actions ── */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {/* Mobile Search Trigger */}
                        <IconButton
                            icon="search"
                            label="Abrir búsqueda"
                            size="md"
                            variant="ghost"
                            className="md:hidden"
                            onClick={() => setMobileSearchOpen(true)}
                        />

                        {/* Become a Pro – lg+ */}
                        <Link
                            href="/register/provider"
                            className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200 px-3 py-2 rounded-xl hover:bg-slate-50 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
                            Ser Pro
                        </Link>

                        <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />

                        {/* Language Dropdown */}
                        <DropdownMenu
                            align="right"
                            trigger={
                                <IconButton icon="language" label="Cambiar idioma" size="md" variant="ghost" />
                            }
                        >
                            <div className="px-4 py-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Idioma</p>
                            </div>
                            {languages.map((lang) => (
                                <DropdownItem
                                    key={lang.code}
                                    icon={undefined}
                                    label={`${lang.flag}  ${lang.label}`}
                                    active={currentLang === lang.code}
                                    onClick={() => setCurrentLang(lang.code)}
                                />
                            ))}
                        </DropdownMenu>

                        {/* User Menu Dropdown */}
                        <DropdownMenu
                            align="right"
                            trigger={
                                <button
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-full pl-3.5 pr-1.5 py-1.5 transition-all duration-200 group border",
                                        "hover:shadow-md active:scale-95",
                                        scrolled
                                            ? "border-slate-200 bg-white hover:border-primary/30"
                                            : "border-slate-200/80 bg-white/90 hover:border-primary/30 hover:bg-white"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-600 transition-colors">
                                        menu
                                    </span>
                                    <div className="size-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
                                        <span className="material-symbols-outlined text-slate-500 text-[17px]">
                                            person
                                        </span>
                                    </div>
                                </button>
                            }
                        >
                            <DropdownItem icon="login" label="Iniciar sesión" onClick={() => window.location.href = "/login"} />
                            <DropdownItem icon="person_add" label="Registrarse" onClick={() => window.location.href = "/register"} />
                            <DropdownDivider />
                            <DropdownItem icon="bolt" label="Ser Pro" description="Ofrecé tus servicios" onClick={() => window.location.href = "/register/provider"} />
                            <DropdownItem icon="help" label="Centro de ayuda" />
                        </DropdownMenu>
                    </div>
                </div>
            </motion.header>

            <MobileSearchDrawer
                isOpen={mobileSearchOpen}
                onClose={() => setMobileSearchOpen(false)}
                serviceQuery={serviceQuery}
                locationQuery={locationQuery}
                onServiceChange={setServiceQuery}
                onLocationChange={setLocationQuery}
            />
        </>
    );
}
