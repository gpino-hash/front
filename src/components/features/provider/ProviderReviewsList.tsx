import { Review } from "@/types";
import { Rating } from "@/components/ui/rating";

interface ProviderReviewsListProps {
    reviews: Review[];
    providerRating: number;
    providerReviewCount: number;
}

export function ProviderReviewsList({ reviews, providerRating, providerReviewCount }: ProviderReviewsListProps) {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Resenas</h3>
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">Ordenar:</span>
                    <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                        <option>Mas recientes</option>
                        <option>Mejor calificacion</option>
                    </select>
                </div>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="text-center px-4">
                    <p className="text-3xl font-black text-slate-900">{providerRating}</p>
                    <Rating value={providerRating} size="sm" className="justify-center mt-1" />
                </div>
                <div className="h-12 w-px bg-slate-200" />
                <p className="text-sm text-slate-500">
                    Basado en <span className="font-bold text-slate-900">{providerReviewCount}</span> resenas
                </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                                    {review.userName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{review.userName}</p>
                                    <Rating value={review.rating} size="sm" />
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <p className="text-slate-600 text-sm italic">&quot;{review.comment}&quot;</p>
                        {review.reply && (
                            <div className="ml-6 p-3 bg-slate-50 rounded-lg border-l-2 border-primary">
                                <p className="text-[11px] font-bold text-primary mb-1">Respuesta del profesional</p>
                                <p className="text-sm text-slate-500 italic">&quot;{review.reply}&quot;</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {reviews.length > 0 && (
                <button className="w-full py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl border border-primary/20 transition-colors">
                    Ver todas las resenas
                </button>
            )}
        </section>
    );
}
