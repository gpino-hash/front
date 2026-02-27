import { Provider } from "@/types";

export const providers: Provider[] = [
    {
        id: "p1",
        name: "Carlos Rodríguez",
        initials: "CR",
        avatarColor: "bg-emerald-500",
        category: "Electricidad",
        specialty: "Electricista Matriculado",
        rating: 4.9,
        reviewCount: 156,
        pricePerHour: 12500,
        isVerified: true,
        isTopPro: true,
        description: "Especialista en instalaciones eléctricas residenciales y comerciales con más de 15 años de experiencia. Trabajo garantizado y presupuestos sin cargo.",
        services: [
            { id: "s1", name: "Instalación de ventilador", price: 8500, duration: "1h", description: "Instalación completa y prueba de funcionamiento." },
            { id: "s2", name: "Revisión de tablero eléctrico", price: 12000, duration: "1.5h", description: "Control preventivo de térmicas y disyuntor." }
        ],
        zones: ["Palermo", "Belgrano", "Colegiales", "Villa Urquiza"],
        availability: [
            { day: "Lunes a Viernes", hours: "09:00 - 18:00" },
            { day: "Sábados", hours: "09:00 - 13:00" }
        ],
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
        portfolio: [
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
        ],
    },
    {
        id: "p2",
        name: "Mariana López",
        initials: "ML",
        avatarColor: "bg-pink-500",
        category: "Limpieza",
        specialty: "Limpieza Profunda",
        rating: 4.8,
        reviewCount: 89,
        pricePerHour: 6500,
        isVerified: true,
        description: "Servicio de limpieza detallista para hogares y oficinas. Uso de productos biodegradables y personal de confianza.",
        services: [
            { id: "s3", name: "Limpieza post-obra", price: 25000, duration: "5h", description: "Eliminación de restos de pintura y polvo fino." }
        ],
        zones: ["CABA", "Vicente López"],
        availability: [{ day: "Lunes a Sábado", hours: "08:00 - 16:00" }],
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
        portfolio: [
            "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1527515637462-cee1395c3694?w=800&h=600&fit=crop",
        ],
    },
    {
        id: "p3",
        name: "Juan Pérez",
        initials: "JP",
        avatarColor: "bg-blue-500",
        category: "Plomería",
        specialty: "Plomería Integral",
        rating: 4.7,
        reviewCount: 42,
        pricePerHour: 11000,
        isVerified: true,
        description: "Reparación de cañerías, griferías y destapaciones. Atención de urgencias 24hs en toda la zona norte.",
        services: [
            { id: "s4", name: "Reparación de mochila", price: 7000, duration: "1h", description: "Cambio de flotante y válvulas." }
        ],
        zones: ["San Isidro", "Olivos", "Martínez"],
        availability: [{ day: "Toda la semana", hours: "Las 24hs" }],
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop",
        portfolio: [
            "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
        ],
    },
    {
        id: "p4",
        name: "Sofía Martínez",
        initials: "SM",
        avatarColor: "bg-amber-500",
        category: "Pintura",
        specialty: "Pintura Decorativa",
        rating: 5.0,
        reviewCount: 28,
        pricePerHour: 9500,
        isVerified: true,
        description: "Trabajos de pintura de alta calidad. Colocación de papel base y empapelados. Limpieza absoluta al finalizar.",
        services: [
            { id: "s5", name: "Pintura de habitación", price: 35000, duration: "8h", description: "Incluye enduído y dos manos de pintura." }
        ],
        zones: ["Caballito", "Almagro", "Flores"],
        availability: [{ day: "Lunes a Viernes", hours: "08:30 - 17:30" }],
        image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&h=600&fit=crop",
        portfolio: [
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?w=800&h=600&fit=crop",
        ],
    },
    {
        id: "p5",
        name: "Roberto Gómez",
        initials: "RG",
        avatarColor: "bg-slate-500",
        category: "Cerrajeria",
        specialty: "Cerrajería de Seguridad",
        rating: 4.6,
        reviewCount: 65,
        pricePerHour: 10500,
        isVerified: true,
        description: "Aperturas urgentes y cambio de combinación de cerraduras de alta seguridad. Cerrajería automotriz.",
        services: [
            { id: "s6", name: "Apertura de puerta", price: 15000, duration: "0.5h", description: "Servicio de apertura sin rotura (sujeto a evaluación)." }
        ],
        zones: ["Recoleta", "Microcentro", "San Telmo"],
        availability: [{ day: "Toda la semana", hours: "Las 24hs" }],
        image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop",
        portfolio: [
            "https://images.unsplash.com/photo-1573511860802-0e3113ca4589?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
        ],
    }
];
