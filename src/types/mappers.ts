import type { Provider, Category, SubService, ServiceOffer, Review } from "./index";
import type {
  ApiProvider,
  ApiProviderService,
  ApiPublicCategory,
  ApiServiceRequest,
} from "./api";

// -- Colores de avatar por defecto --
const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

// -- Provider --

export function mapApiProviderToProvider(
  apiProvider: ApiProvider,
  services: ApiProviderService[] = [],
  availability: { dayOfWeek: string; startTime: string; endTime: string }[] = [],
  zones: string[] = []
): Provider {
  return {
    id: apiProvider.id,
    name: apiProvider.displayName,
    initials: getInitials(apiProvider.displayName),
    avatarColor: getAvatarColor(apiProvider.id),
    category: "",
    specialty: apiProvider.headline ?? "",
    rating: apiProvider.rating ?? 0,
    reviewCount: apiProvider.totalReviews,
    pricePerHour: apiProvider.hourlyRate ?? 0,
    isVerified: apiProvider.verificationStatus === "VERIFIED",
    isTopPro: apiProvider.completedJobs >= 50,
    description: apiProvider.bio ?? "",
    services: services.map(mapApiProviderServiceToServiceOffer),
    zones,
    availability: availability.map((a) => ({
      day: DAY_LABELS[a.dayOfWeek] ?? a.dayOfWeek,
      hours: `${a.startTime} - ${a.endTime}`,
    })),
    portfolio: [],
  };
}

export function mapApiProviderServiceToServiceOffer(
  s: ApiProviderService
): ServiceOffer {
  return {
    id: s.id,
    name: s.name,
    price: s.price,
    duration: s.formattedDuration ?? "",
    description: s.description ?? s.shortDescription ?? "",
  };
}

// -- Category --

export function mapApiCategoryToCategory(cat: ApiPublicCategory): Category {
  const subServices: SubService[] = cat.children.map((child) => ({
    name: child.name,
    icon: child.icon ?? "handyman",
    description: child.description ?? "",
  }));

  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon ?? "category",
    description: cat.description ?? "",
    providerCount: cat.providerCount,
    subServices,
  };
}

// -- Service Request status mapping --

export type UIRequestStatus =
  | "PENDING_QUOTE"
  | "QUOTED"
  | "ACCEPTED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export function mapApiStatusToUIStatus(
  apiStatus: ApiServiceRequest["status"]
): UIRequestStatus {
  const map: Record<typeof apiStatus, UIRequestStatus> = {
    OPEN: "PENDING_QUOTE",
    QUOTED: "QUOTED",
    ACCEPTED: "ACCEPTED",
    CLOSED: "CANCELLED",
    EXPIRED: "CANCELLED",
  };
  return map[apiStatus];
}
