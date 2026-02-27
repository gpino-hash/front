import { MockProviderService } from "./impl/MockProviderService";
import { MockReviewService } from "./impl/MockReviewService";
import { MockCategoryService } from "./impl/MockCategoryService";
import { ServiceRegistry } from "./ServiceContext";

export function createMockServices(): ServiceRegistry {
    return {
        providerService: new MockProviderService(),
        reviewService: new MockReviewService(),
        categoryService: new MockCategoryService(),
    };
}
