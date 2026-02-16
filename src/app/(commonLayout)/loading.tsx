import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="px-4 py-8 space-y-6">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-56 w-full" />
            </div>
        </div>
    );
}
