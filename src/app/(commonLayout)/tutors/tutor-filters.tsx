"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface TutorFiltersProps {
    categories: Category[];
}

export default function TutorFilters({ categories }: TutorFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [category, setCategory] = useState(
        searchParams.get("category") ?? "all",
    );
    const [minRating, setMinRating] = useState(
        searchParams.get("minRating") ?? "",
    );
    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") ?? "",
    );

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category !== "all") params.set("category", category);
        if (minRating.trim()) params.set("minRating", minRating.trim());
        if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());

        const query = params.toString();
        router.push(`/tutors${query ? `?${query}` : ""}`);
    }, [search, category, minRating, maxPrice, router]);

    const handleCategoryChange = useCallback(
        (selectedCategory: string) => {
            setCategory(selectedCategory);

            const params = new URLSearchParams();
            if (search.trim()) params.set("search", search.trim());
            if (selectedCategory !== "all") {
                params.set("category", selectedCategory);
            }
            if (minRating.trim()) params.set("minRating", minRating.trim());
            if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());

            const query = params.toString();
            router.push(`/tutors${query ? `?${query}` : ""}`);
        },
        [search, minRating, maxPrice, router],
    );

    const resetFilters = useCallback(() => {
        setSearch("");
        setCategory("all");
        setMinRating("");
        setMaxPrice("");
        router.push("/tutors");
    }, [router]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Input
                        placeholder="Search by name or subject"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    />
                    <Select
                        value={category}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.name} value={cat.name}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Min rating (e.g. 4.5)"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    />
                    <Input
                        placeholder="Max price (e.g. 25)"
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button type="button" onClick={applyFilters}>
                        Apply Filters
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetFilters}
                    >
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
