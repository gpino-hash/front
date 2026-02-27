"use client";

import { useState, useCallback, useEffect } from "react";
import { Provider } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProviderGalleryProps {
    provider: Provider;
}

export function ProviderGallery({ provider }: ProviderGalleryProps) {
    const allImages = [provider.image, ...(provider.portfolio ?? [])].filter(Boolean) as string[];
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (idx: number) => setLightboxIndex(idx);
    const closeLightbox = () => setLightboxIndex(null);

    const goNext = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }, [lightboxIndex, allImages.length]);

    const goPrev = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
    }, [lightboxIndex, allImages.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [lightboxIndex, goNext, goPrev]);

    if (allImages.length === 0) {
        return (
            <div className="h-[300px] md:h-[450px] bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-slate-300">image</span>
            </div>
        );
    }

    const extraCount = allImages.length - 3;

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[450px]">
                {/* Main image */}
                <button
                    onClick={() => openLightbox(0)}
                    className="col-span-4 md:col-span-3 row-span-2 bg-slate-200 rounded-xl overflow-hidden relative cursor-pointer group"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${allImages[0]}')` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>

                {/* Side image 1 */}
                <button
                    onClick={() => openLightbox(allImages.length > 1 ? 1 : 0)}
                    className="hidden md:block col-span-1 row-span-1 bg-slate-200 rounded-xl overflow-hidden relative cursor-pointer group"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${allImages[1] ?? allImages[0]}')` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>

                {/* Side image 2 — with "+N Fotos" overlay */}
                <button
                    onClick={() => openLightbox(allImages.length > 2 ? 2 : 0)}
                    className="hidden md:block col-span-1 row-span-1 bg-slate-200 rounded-xl overflow-hidden relative cursor-pointer group"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${allImages[2] ?? allImages[0]}')` }}
                    />
                    {extraCount > 0 && (
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <span className="text-white font-bold text-lg">+{extraCount} Fotos</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 size-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>

                        {/* Counter */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm font-bold">
                            {lightboxIndex + 1} / {allImages.length}
                        </div>

                        {/* Prev button */}
                        {allImages.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                            </button>
                        )}

                        {/* Next button */}
                        {allImages.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                            </button>
                        )}

                        {/* Image */}
                        <motion.img
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            src={allImages[lightboxIndex]}
                            alt={`Foto ${lightboxIndex + 1} de ${provider.name}`}
                            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl select-none"
                            onClick={(e) => e.stopPropagation()}
                            draggable={false}
                        />

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto no-scrollbar px-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                        className={`size-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                                            idx === lightboxIndex
                                                ? "border-white opacity-100 scale-110"
                                                : "border-transparent opacity-50 hover:opacity-80"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
