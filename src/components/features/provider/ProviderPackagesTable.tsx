import { ServiceOffer } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProviderPackagesTableProps {
    services: ServiceOffer[];
}

export function ProviderPackagesTable({ services }: ProviderPackagesTableProps) {
    if (services.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Paquetes de servicio</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Servicio</th>
                            <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Detalle</th>
                            <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Precio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {services.map((service, idx) => (
                            <tr
                                key={service.id}
                                className={`hover:bg-slate-50 transition-colors ${idx === 0 ? "bg-primary/5" : ""}`}
                            >
                                <td className="p-4 font-medium text-slate-900">
                                    {service.name}
                                    {idx === 0 && (
                                        <span className="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase font-bold">
                                            Popular
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-slate-600 text-sm">
                                    {service.description}
                                    <span className="text-slate-400 ml-2">({service.duration})</span>
                                </td>
                                <td className="p-4 font-bold text-primary whitespace-nowrap">
                                    {formatPrice(service.price)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
