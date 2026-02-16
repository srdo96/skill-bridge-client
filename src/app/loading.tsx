import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-10 space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <Skeleton className="h-5 w-full max-w-xl" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    );
}
