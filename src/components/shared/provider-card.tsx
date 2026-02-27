import { Provider } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProviderCardProps {
    provider: Provider;
}

const defaultImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDqjDAduSu3DWJk604qlwCcI_Wi4KNfwT_5zV1qZChJi_uwkKCSr6EX6h0_w8taKCJ1xOZvFpKnSs5iG2nHb6Ekk6Ow-UfamhY48Fcngsg0AO0GNGZhnvGx-1eAZSSIhdkl0IhEHcemmNwOLIUSE__fXR3rAdEKCT2eMWj4VKSuIm2Dp3SYzOj3a_bIrKc-djUQhc1aEC0KHD5d3yhLxVOf98ceQsWog2fjMo_C0Zx8NSVbChFJdsOHLMeY3BP6arLNic9bssDcs30";

export function ProviderCard({ provider }: ProviderCardProps) {
    const imageUrl = provider.image || defaultImage;
    const priceFormatted = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(provider.pricePerHour);

    const isAvailableNow =
        provider.availability[0]?.hours?.includes("24") || false;

    return (
        <Link href={`/providers/${provider.id}`} className="block group">
            <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl overflow-hidden flex flex-col h-full
                           border border-slate-100 ring-1 ring-black/[0.02]
                           hover:shadow-[0_24px_60px_rgba(0,0,0,0.11)]
                           hover:border-slate-200 transition-all duration-400"
            >
                {/* ── Image section ── */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-in-out"
                        alt={provider.name}
                        src={imageUrl}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Progressive gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-400" />

                    {/* Bookmark button */}
                    <button
                        aria-label={`Guardar a ${provider.name}`}
                        className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm
                                   flex items-center justify-center text-slate-400
                                   hover:bg-white hover:text-primary hover:scale-110
                                   active:scale-95 transition-all duration-200 shadow-sm z-10"
                        onClick={(e) => e.preventDefault()}
                    >
                        <span className="material-symbols-outlined text-[18px]">bookmark</span>
                    </button>

                    {/* Badges - top left */}
                    <div className="absolute top-3.5 left-3.5 flex gap-2 z-10">
                        {provider.isTopPro && (
                            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">
                                <span className="material-symbols-outlined text-amber-500 text-[14px] fill-current">verified</span>
                                Super Pro
                            </div>
                        )}
                        {!provider.isTopPro && provider.isVerified && (
                            <div className="flex items-center gap-1 bg-primary backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">
                                <span className="material-symbols-outlined text-[13px] fill-current">verified</span>
                                Verificado
                            </div>
                        )}
                    </div>

                    {/* Availability pill - bottom left, visible over gradient */}
                    <div className="absolute bottom-3.5 left-3.5 z-10">
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm uppercase tracking-wider
                            ${isAvailableNow
                                ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300"
                                : "bg-white/10 border border-white/20 text-white/70"}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${isAvailableNow ? "bg-emerald-400 animate-pulse-ring" : "bg-white/50"}`} />
                            {isAvailableNow ? "Disponible ahora" : "Disponible hoy"}
                        </div>
                    </div>
                </div>

                {/* ── Content section ── */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Name + Rating */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-[1.05rem] text-slate-900 group-hover:text-primary transition-colors leading-tight flex-1 mr-3">
                            {provider.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg flex-shrink-0">
                            <span className="material-symbols-outlined text-amber-400 text-[13px] fill-current">star</span>
                            <span className="text-sm font-black text-slate-800">{provider.rating}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({provider.reviewCount})</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                        {provider.description}
                    </p>

                    {/* Divider + Meta */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-5 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[17px] text-slate-300">location_on</span>
                                <span className="font-semibold text-slate-600">{provider.zones[0]}</span>
                            </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Desde</span>
                                <span className="font-black text-2xl text-slate-900 leading-none">
                                    {priceFormatted}{" "}
                                    <span className="text-xs font-medium text-slate-400">/ hr</span>
                                </span>
                            </div>
                            <span className="flex items-center gap-1.5 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-2xl
                                            shadow-[0_6px_20px_rgba(15,98,254,0.30)]
                                            hover:bg-primary-dark hover:shadow-[0_8px_24px_rgba(15,98,254,0.40)]
                                            group-hover:translate-x-0.5 active:scale-95 transition-all duration-300">
                                Reservar
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
