"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { completeBooking } from "@/actions/booking.action";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus } from "@/types/user.types";

const statusVariants: Record<
    BookingStatus,
    "warning" | "success" | "destructive"
> = {
    [BookingStatus.CONFIRMED]: "warning",
    [BookingStatus.COMPLETED]: "success",
    [BookingStatus.CANCELLED]: "destructive",
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const formatTimeRange = (start: string, end: string) =>
    `${start ?? "--"} - ${end ?? "--"}`;

export function TutorSessionsList({ sessions }: { sessions: Booking[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleComplete = (bookingId: string) => {
        const toastId = toast.loading("Marking session complete...");
        startTransition(() => {
            void (async () => {
                const result = await completeBooking(bookingId);
                if (result?.error) {
                    toast.error(result.error.message, { id: toastId });
                    return;
                }
                toast.success("Session marked as completed", { id: toastId });
                router.refresh();
            })();
        });
    };

    if (sessions.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
        );
    }

    return (
        <div className="space-y-3">
            {sessions.map((session) => (
                <div key={session.booking_id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">
                                {session.subject?.name ?? "Session"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {session.student?.name ?? "Student"} .{" "}
                                {session.day_of_week} .{" "}
                                {formatTimeRange(
                                    session.start_time,
                                    session.end_time,
                                )}
                            </p>
                        </div>
                        <Badge
                            variant={
                                statusVariants[session.status] ?? "secondary"
                            }
                        >
                            {session.status === BookingStatus.CONFIRMED
                                ? "Up Coming"
                                : session.status}
                        </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Booked {formatDate(session.created_at)}</span>
                        <span>. </span>
                        <span>Price: ${session.price}</span>
                        {session.meeting_link && (
                            <>
                                <span>. </span>
                                <a
                                    href={session.meeting_link}
                                    className="text-primary underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Meeting link
                                </a>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
