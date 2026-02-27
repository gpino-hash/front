import { Provider } from "@/types";

interface ProviderDescriptionProps {
    provider: Provider;
}

export function ProviderDescription({ provider }: ProviderDescriptionProps) {
    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Descripcion del servicio</h3>
            <div className="text-slate-600 leading-relaxed space-y-4">
                <p>{provider.description}</p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 list-none p-0">
                    {provider.isVerified && (
                        <li className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            Identidad verificada
                        </li>
                    )}
                    {provider.isTopPro && (
                        <li className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            Top Pro destacado
                        </li>
                    )}
                    <li className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        Presupuesto sin cargo
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        Garantia en cada trabajo
                    </li>
                </ul>

                {/* Availability & Zones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 bg-slate-50 rounded-xl">
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                            Disponibilidad
                        </h4>
                        <div className="space-y-1.5">
                            {provider.availability.map((a, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-600">{a.day}</span>
                                    <span className="text-slate-500">{a.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                            Zonas de cobertura
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {provider.zones.map((z, i) => (
                                <span key={i} className="inline-flex px-3 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                                    {z}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
