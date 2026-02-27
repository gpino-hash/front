"use client";

import { useState, useEffect, useMemo } from "react";
import { Category } from "@/types";
import { useServices } from "@/services/ServiceContext";

export function useServicesCatalog() {
    const { categoryService } = useServices();
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Error fetching categories"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [categoryService]);

    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const popularCategories = useMemo(() => {
        return [...categories]
            .sort((a, b) => b.providerCount - a.providerCount)
            .slice(0, 6);
    }, [categories]);

    const activeCategoryData = useMemo(() => {
        return categories.find(c => c.id === activeCategory) ?? null;
    }, [categories, activeCategory]);

    return {
        categories: filteredCategories,
        allCategories: categories,
        popularCategories,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        activeCategoryData,
    };
}
