import { apiFetch } from "@/lib/api/api-client";
import type { IReviewService } from "@/services/types";
import type { Review } from "@/types";

export class ApiReviewService implements IReviewService {
  async getReviewsByProviderId(providerId: string): Promise<Review[]> {
    try {
      const res = await apiFetch<Review[] | { data: Review[] }>(
        `/reviews?providerId=${providerId}`
      );
      return Array.isArray(res) ? res : res.data;
    } catch {
      return [];
    }
  }
}
