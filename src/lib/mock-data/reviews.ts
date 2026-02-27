import { Review } from "@/types";

export const reviews: Review[] = [
    {
        id: "r1",
        providerId: "p1",
        userId: "u1",
        userName: "Laura Giménez",
        rating: 5,
        comment: "Excelente profesional. Puntual, amable y el trabajo quedó perfecto. Muy recomendable.",
        date: "2024-02-15",
        reply: "Gracias Laura! Un placer haberte ayudado."
    },
    {
        id: "r2",
        providerId: "p1",
        userId: "u2",
        userName: "Mateo Rossi",
        rating: 4,
        comment: "Muy buen servicio, explicó todo lo que hacía. El precio me pareció justo.",
        date: "2024-01-28"
    },
    {
        id: "r3",
        providerId: "p2",
        userId: "u3",
        userName: "Delfina Sosa",
        rating: 5,
        comment: "Mariana es una genia. Dejó la casa impecable después de la mudanza. Súper detallista.",
        date: "2024-02-10"
    }
];
