import { Provider } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProviderOtherServicesProps {
    provider: Provider;
}

export function ProviderOtherServices({ provider }: ProviderOtherServicesProps) {
    if (provider.services.length <= 1) return null;

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-slate-900 px-2">Otros servicios de este profesional</h4>
            <div className="space-y-3">
                {provider.services.slice(1).map((service) => (
                    <div
                        key={service.id}
                        className="group flex gap-3 p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                    >
                        <div className="size-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[24px]">
                                home_repair_service
                            </span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                {service.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                Desde {formatPrice(service.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
