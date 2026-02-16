import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full">
            <aside className="hidden w-64 border-r p-4 md:block space-y-3">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-4/5" />
            </aside>
            <main className="flex-1 p-4 space-y-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-80 w-full" />
            </main>
        </div>
    );
}
