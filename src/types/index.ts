export type UserRole = "client" | "provider" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    phone?: string;
}

export interface SubService {
    name: string;
    icon: string;
    description: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    providerCount: number;
    subServices?: SubService[];
}

export interface ServiceOffer {
    id: string;
    name: string;
    price: number;
    duration: string;
    description: string;
}

export interface Provider {
    id: string;
    name: string;
    initials: string;
    avatarColor: string; // Gradient or hex
    category: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    pricePerHour: number;
    isVerified: boolean;
    isTopPro?: boolean;
    description: string;
    services: ServiceOffer[];
    zones: string[];
    availability: {
        day: string;
        hours: string;
    }[];
    portfolio?: string[]; // URLs or placeholders
    image?: string;
}

export interface Review {
    id: string;
    providerId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    reply?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    avatar: string;
    role: string;
    content: string;
    rating: number;
}
