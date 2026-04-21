"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Panel", href: "/dashboard/proveedor" },
  { icon: "storefront", label: "Mi Negocio", href: "/dashboard/proveedor/negocio" },
  { icon: "handyman", label: "Servicios", href: "/dashboard/proveedor/servicios" },
  { icon: "calendar_month", label: "Agenda", href: "/dashboard/proveedor/agenda" },
  { icon: "book_online", label: "Reservas", href: "/dashboard/proveedor/reservas" },
  { icon: "work", label: "Oportunidades", href: "/dashboard/proveedor/oportunidades" },
  { icon: "chat", label: "Mensajes", href: "/dashboard/proveedor/mensajes" },
  { icon: "person", label: "Perfil", href: "/dashboard/proveedor/perfil" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/proveedor") return pathname === href;
  return pathname.startsWith(href);
}

export function ProviderDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-[1440px] mx-auto flex">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex flex-col gap-1 p-4 pt-6">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">
              Dashboard
            </p>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px]",
                      active ? "text-orange-500" : ""
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile nav */}
          <div className="lg:hidden flex overflow-x-auto border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 gap-1 scrollbar-thin">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors",
                    active
                      ? "border-orange-500 text-orange-600 dark:text-orange-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
