"use client";

import { usePathname } from "next/navigation";
import { ProviderDashboardLayout } from "@/components/features/provider-dashboard/ProviderDashboardLayout";

export default function ProviderDashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // The pending page renders full-screen without sidebar
  if (pathname === "/dashboard/proveedor/pendiente") {
    return <>{children}</>;
  }

  return <ProviderDashboardLayout>{children}</ProviderDashboardLayout>;
}
