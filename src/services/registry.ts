import { MockProviderService } from "./impl/MockProviderService";
import { MockReviewService } from "./impl/MockReviewService";
import { MockCategoryService } from "./impl/MockCategoryService";
import { MockCatalogService } from "./impl/MockCatalogService";
import { MockProviderManagementService } from "./impl/MockProviderManagementService";
import { MockProviderServiceService } from "./impl/MockProviderServiceService";
import { MockServiceRequestService } from "./impl/MockServiceRequestService";
import { ApiProviderReadService } from "./impl/api/ApiProviderReadService";
import { ApiReviewService } from "./impl/api/ApiReviewService";
import { ApiCategoryReadService } from "./impl/api/ApiCategoryReadService";
import { ApiCatalogService } from "./impl/api/ApiCatalogService";
import { ApiProviderManagementService } from "./impl/api/ApiProviderManagementService";
import { ApiProviderServiceService } from "./impl/api/ApiProviderServiceService";
import { ApiServiceRequestService } from "./impl/api/ApiServiceRequestService";
import type { ServiceRegistry } from "./ServiceContext";

function createMockServices(): ServiceRegistry {
  return {
    providerService: new MockProviderService(),
    reviewService: new MockReviewService(),
    categoryService: new MockCategoryService(),
    catalogService: new MockCatalogService(),
    providerManagementService: new MockProviderManagementService(),
    providerServiceService: new MockProviderServiceService(),
    serviceRequestService: new MockServiceRequestService(),
  };
}

function createApiServices(): ServiceRegistry {
  return {
    providerService: new ApiProviderReadService(),
    reviewService: new ApiReviewService(),
    categoryService: new ApiCategoryReadService(),
    catalogService: new ApiCatalogService(),
    providerManagementService: new ApiProviderManagementService(),
    providerServiceService: new ApiProviderServiceService(),
    serviceRequestService: new ApiServiceRequestService(),
  };
}

export function createServices(): ServiceRegistry {
  const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
  return useMocks ? createMockServices() : createApiServices();
}

export { createMockServices };
