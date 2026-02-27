import { Provider } from "@/types";
import { IProviderService } from "../types";
import { providers } from "@/lib/mock-data/providers";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockProviderService implements IProviderService {
    async getProviderById(id: string): Promise<Provider | undefined> {
        await delay(400);
        return providers.find(p => p.id === id);
    }

    async getAllProviders(): Promise<Provider[]> {
        await delay(1500);
        return providers;
    }

    async getFeaturedProviders(): Promise<Provider[]> {
        await delay(800);
        return providers.filter(p => p.isTopPro);
    }
}
