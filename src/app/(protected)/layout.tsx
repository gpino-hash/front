import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <VerificationBanner />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}