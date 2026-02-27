import { Provider } from "@/types";

interface ProviderProfileCardProps {
    provider: Provider;
}

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
    return (
        <section className="p-6 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4 items-center">
                {/* Avatar */}
                <div className={`size-16 rounded-full flex items-center justify-center text-white text-xl font-bold ring-2 ring-primary ${provider.avatarColor}`}>
                    {provider.initials}
                </div>
                <div className="flex flex-col">
                    <p className="text-slate-900 text-xl font-bold">{provider.name}</p>
                    <p className="text-slate-500 text-sm">
                        {provider.isTopPro && "Top Pro • "}
                        {provider.specialty}
                        {provider.isVerified && " • Verificado"}
                    </p>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors text-sm">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    Contactar
                </button>
                <button className="flex items-center justify-center size-11 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
                <button className="flex items-center justify-center size-11 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
            </div>
        </section>
    );
}
