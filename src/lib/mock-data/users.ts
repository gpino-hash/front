import { User } from "@/types";

export const mockUsers: User[] = [
    {
        id: "u1",
        name: "Demo Cliente",
        email: "cliente@demo.com",
        role: "client",
        phone: "+54 11 1234-5678"
    },
    {
        id: "u2",
        name: "Demo Pro",
        email: "proveedor@demo.com",
        role: "provider",
        phone: "+54 11 9876-5432"
    },
    {
        id: "u3",
        name: "Demo Admin",
        email: "admin@profesio.com",
        role: "admin"
    }
];
