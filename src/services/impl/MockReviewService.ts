import { Review } from "@/types";
import { IReviewService } from "../types";
import { reviews } from "@/lib/mock-data/reviews";

export class MockReviewService implements IReviewService {
    async getReviewsByProviderId(providerId: string): Promise<Review[]> {
        return reviews.filter(r => r.providerId === providerId);
    }
}
