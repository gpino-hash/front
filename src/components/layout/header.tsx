"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { MobileSearchDrawer } from "@/components/shared/mobile-search-drawer";
import { DropdownMenu, DropdownItem, DropdownDivider } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/* ═══════════════════════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════════════════════ */

type ViewMode = "public" | "client" | "provider";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const clientNav: NavItem[] = [
    { label: "Mis Proyectos", href: "/dashboard/cliente", icon: "format_list_bulleted" },
    { label: "Mensajes", href: "#", icon: "mail" },
];

const providerNav: NavItem[] = [
    { label: "Trabajos", href: "/dashboard/proveedor", icon: "work" },
    { label: "Agenda", href: "/dashboard/proveedor/agenda", icon: "calendar_month" },
    { label: "Ingresos", href: "#", icon: "payments" },
];

/* ═══════════════════════════════════════════════════════
   Mobile Menu Drawer
   ═══════════════════════════════════════════════════════ */

function MobileMenuDrawer({
    isOpen,
    onClose,
    user,
    isAuthenticated,
    viewMode,
    isDualRole,
    onSwitchMode,
    onLogout,
    navItems,
}: {
    isOpen: boolean;
    onClose: () => void;
    user: ReturnType<typeof useAuth>["user"];
    isAuthenticated: boolean;
    viewMode: ViewMode;
    isDualRole: boolean;
    onSwitchMode: () => void;
    onLogout: () => void;
    navItems: NavItem[];
}) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            const handleKey = (e: KeyboardEvent) => {
                if (e.key === "Escape") onClose();
            };
            document.addEventListener("keydown", handleKey);
            return () => {
                document.body.style.overflow = "";
                document.removeEventListener("keydown", handleKey);
            };
        }
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />
            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                    <Logo size="sm" />
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg"
                        aria-label="Cerrar menú"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
                    {/* User Info */}
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-700">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.firstName ?? ""}
                                    className="size-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600"
                                />
                            ) : (
                                <div className="size-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center ring-2 ring-white dark:ring-slate-700">
                                    <span className="text-white text-sm font-bold">
                                        {(user.firstName?.[0] ?? user.email?.[0] ?? "").toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}
                                </p>
                                <Link
                                    href="/perfil"
                                    className="text-xs text-primary font-medium"
                                    onClick={onClose}
                                >
                                    Ver Perfil
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Nav */}
                    <nav className="space-y-1">
                        {!isAuthenticated && (
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-slate-400">home</span>
                                Inicio
                            </Link>
                        )}
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-slate-400">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Switch Mode */}
                    {isDualRole && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 px-3 tracking-wider">
                                Cambiar modo
                            </p>
                            <button
                                onClick={() => {
                                    onSwitchMode();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary/30 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <span className={cn(
                                        "material-symbols-outlined",
                                        viewMode === "client" ? "text-orange-500" : "text-primary"
                                    )}>
                                        {viewMode === "client" ? "engineering" : "person"}
                                    </span>
                                    {viewMode === "client" ? "Cambiar a Proveedor" : "Cambiar a Cliente"}
                                </span>
                                <span className="material-symbols-outlined text-slate-400 text-lg">arrow_forward</span>
                            </button>
                        </div>
                    )}

                    {/* Auth Actions */}
                    {!isAuthenticated ? (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                            <button
                                onClick={() => { router.push("/login"); onClose(); }}
                                className="w-full py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => { router.push("/register"); onClose(); }}
                                className="w-full py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                            >
                                Registrarse
                            </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={() => { onLogout(); onClose(); }}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                            >
                                <span className="material-symbols-outlined text-red-400">logout</span>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════════════════
   Header
   ═══════════════════════════════════════════════════════ */

export function Header() {
    const [serviceQuery, setServiceQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [heroSearchVisible, setHeroSearchVisible] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    // Determine view mode from pathname
    const isProviderPath = pathname.startsWith("/dashboard/proveedor");
    const isClientPath = pathname.startsWith("/dashboard/cliente");
    const isHome = pathname === "/";

    const isProvider = user?.roles?.includes("PROVIDER");
    const isClient = user?.roles?.includes("CLIENT");
    const isDualRole = !!(isProvider && isClient);

    const viewMode: ViewMode = !isAuthenticated
        ? "public"
        : isProviderPath
            ? "provider"
            : isClientPath
                ? "client"
                : isProvider && !isClient
                    ? "provider"
                    : "client";

    const isProviderView = viewMode === "provider";

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Observe hero search visibility
    useEffect(() => {
        if (!isHome) {
            requestAnimationFrame(() => setHeroSearchVisible(false));
            return;
        }
        const heroSearch = document.getElementById("hero-search");
        if (!heroSearch) {
            requestAnimationFrame(() => setHeroSearchVisible(false));
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => setHeroSearchVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(heroSearch);
        return () => observer.disconnect();
    }, [isHome]);

    const handleLogout = useCallback(async () => {
        await logout();
        router.push("/");
    }, [logout, router]);

    const handleSwitchMode = useCallback(() => {
        if (viewMode === "client") {
            router.push("/dashboard/proveedor");
        } else {
            router.push("/dashboard/cliente");
        }
    }, [viewMode, router]);

    const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "";
    const userInitials = displayName
        ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.charAt(0).toUpperCase() || "";

    const navItems = isProviderView ? providerNav : isAuthenticated ? clientNav : [];
    const activeNavItem = navItems.find((item) => pathname.startsWith(item.href) && item.href !== "#");

    return (
        <>
            <motion.header
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-300",
                    scrolled
                        ? "bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border-b border-slate-200/70 dark:border-slate-700/70 shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
                        : "bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">

                    {/* ── Left: Logo + Nav ── */}
                    <div className="flex items-center gap-6 lg:gap-8 shrink-0">
                        <div className="flex items-center gap-2">
                            <Logo size="sm" />
                            {isProviderView && (
                                <span className="text-xs font-medium text-slate-400 ml-0.5">Pro</span>
                            )}
                        </div>

                        {/* Desktop Nav - Tabs for client */}
                        {isAuthenticated && !isDualRole && navItems.length > 0 && (
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isActive = activeNavItem?.href === item.href;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={cn(
                                                "text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                                                isActive
                                                    ? "text-slate-900 dark:text-white border-b-2 border-primary"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}

                        {/* Desktop Nav - Pill nav for provider */}
                        {isAuthenticated && isDualRole && isProviderView && navItems.length > 0 && (
                            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                {navItems.map((item) => {
                                    const isActive = activeNavItem?.href === item.href;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={cn(
                                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                                isActive
                                                    ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-600/50"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </div>

                    {/* ── Center: Search or Role Switcher ── */}
                    {isDualRole ? (
                        /* Role Switcher for dual-role users */
                        <div className="hidden sm:flex flex-1 justify-center">
                            <div className="inline-flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                <button
                                    onClick={() => viewMode !== "client" && handleSwitchMode()}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                                        viewMode === "client"
                                            ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <span className={cn(
                                        "material-symbols-outlined text-base",
                                        viewMode === "client" ? "text-primary" : ""
                                    )}>
                                        person
                                    </span>
                                    <span className="hidden lg:inline">Cliente</span>
                                </button>
                                <button
                                    onClick={() => viewMode !== "provider" && handleSwitchMode()}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                                        viewMode === "provider"
                                            ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <span className={cn(
                                        "material-symbols-outlined text-base",
                                        viewMode === "provider" ? "text-orange-500" : ""
                                    )}>
                                        engineering
                                    </span>
                                    <span className="hidden lg:inline">Proveedor</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Search bar for non-dual users */
                        <div className={cn(
                            "hidden lg:flex flex-1 max-w-md mx-4 transition-all duration-300",
                            heroSearchVisible && isHome ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"
                        )}>
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                                </div>
                                <input
                                    className={cn(
                                        "block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all",
                                        isAuthenticated
                                            ? "border border-slate-200 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            : "border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-600"
                                    )}
                                    placeholder="Buscar servicios..."
                                    type="text"
                                    value={serviceQuery}
                                    onChange={(e) => setServiceQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Right: Actions ── */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                        {/* Search icon (mobile, or dual-role desktop) */}
                        {(isDualRole || true) && (
                            <button
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isDualRole ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" : "lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                )}
                                onClick={() => setMobileSearchOpen(true)}
                                aria-label="Buscar"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                            </button>
                        )}

                        {/* Mode Badge (desktop only) */}
                        {isAuthenticated && (
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={viewMode}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={cn(
                                        "hidden xl:inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                                        isProviderView
                                            ? "bg-orange-50 text-orange-700 ring-orange-600/10"
                                            : "bg-blue-50 text-blue-700 ring-blue-700/10"
                                    )}
                                >
                                    {isProviderView ? "Modo Proveedor" : "Modo Cliente"}
                                </motion.span>
                            </AnimatePresence>
                        )}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700" />

                        {/* Notifications */}
                        {isAuthenticated && (
                            <button
                                className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Notificaciones"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
                                <span className={cn(
                                    "absolute top-1.5 right-1.5 size-2 rounded-full border-2 border-white dark:border-slate-800",
                                    isProviderView ? "bg-orange-500" : "bg-red-500"
                                )} />
                            </button>
                        )}

                        {/* Unauthenticated actions */}
                        {!isAuthenticated && (
                            <>
                                <button
                                    onClick={() => router.push("/login")}
                                    className="hidden sm:flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => router.push("/register")}
                                    className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95"
                                >
                                    Registrarse
                                </button>
                            </>
                        )}

                        {/* User Avatar / Menu */}
                        {isAuthenticated && user && (
                            <DropdownMenu
                                align="right"
                                trigger={
                                    <button
                                        className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                                    >
                                        {/* Name + email (desktop) */}
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                                                {displayName || user.email}
                                            </span>
                                            {displayName && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-1">
                                                    {user.email}
                                                </span>
                                            )}
                                        </div>
                                        {/* Avatar */}
                                        <div className={cn(
                                            "size-9 rounded-full overflow-hidden ring-2 transition-all",
                                            isProviderView
                                                ? "ring-slate-200 dark:ring-slate-600 group-hover:ring-orange-500/40"
                                                : "ring-slate-200 dark:ring-slate-600 group-hover:ring-primary/30"
                                        )}>
                                            {user.avatarUrl ? (
                                                <img
                                                    alt={displayName || "Avatar"}
                                                    className="h-full w-full object-cover"
                                                    src={user.avatarUrl}
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">{userInitials}</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                }
                            >
                                {/* User info header */}
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-800">{displayName || user.email}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                                <DropdownItem icon="dashboard" label="Mi Dashboard" onClick={() => router.push(isProviderView ? "/dashboard/proveedor" : "/dashboard/cliente")} />
                                <DropdownItem icon="person" label="Mi Perfil" onClick={() => router.push("/perfil")} />
                                {isProvider && (
                                    <DropdownItem icon="calendar_month" label="Mi Agenda" onClick={() => router.push("/dashboard/proveedor/agenda")} />
                                )}
                                <DropdownDivider />
                                <DropdownItem icon="help" label="Centro de ayuda" />
                                <DropdownDivider />
                                <DropdownItem icon="logout" label="Cerrar sesión" onClick={handleLogout} />
                            </DropdownMenu>
                        )}

                        {/* Mobile hamburger */}
                        {!isAuthenticated && (
                            <button
                                className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Abrir menú"
                            >
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Mobile Search */}
            <MobileSearchDrawer
                isOpen={mobileSearchOpen}
                onClose={() => setMobileSearchOpen(false)}
                serviceQuery={serviceQuery}
                locationQuery={locationQuery}
                onServiceChange={setServiceQuery}
                onLocationChange={setLocationQuery}
            />

            {/* Mobile Menu */}
            <MobileMenuDrawer
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                user={user}
                isAuthenticated={isAuthenticated}
                viewMode={viewMode}
                isDualRole={isDualRole}
                onSwitchMode={handleSwitchMode}
                onLogout={handleLogout}
                navItems={navItems}
            />
        </>
    );
}