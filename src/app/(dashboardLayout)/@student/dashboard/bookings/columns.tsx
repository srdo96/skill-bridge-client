"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, DollarSign, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { cancelBooking } from "@/actions/booking.action";
import { createReview } from "@/actions/review.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Booking, BookingStatus } from "@/types";

function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

function getStatusVariant(status: BookingStatus) {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return "warning";
        case BookingStatus.COMPLETED:
            return "success";
        case BookingStatus.CANCELLED:
            return "destructive";
        default:
            return "outline";
    }
}

function ActionsCell({ booking }: { booking: Booking }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isReviewOpen, setReviewOpen] = useState(false);
    const [rating, setRating] = useState("5");
    const [comment, setComment] = useState("");

    const isConfirmed = booking.status === BookingStatus.CONFIRMED;
    const isCompleted = booking.status === BookingStatus.COMPLETED;
    const isCancelled = booking.status === BookingStatus.CANCELLED;

    const handleCancel = () => {
        const toastId = toast.loading("Cancelling booking...");
        startTransition(() => {
            void (async () => {
                const result = await cancelBooking(booking.booking_id);
                if (result?.error) {
                    toast.error(result.error.message, { id: toastId });
                    return;
                }
                toast.success("Booking cancelled", { id: toastId });
                router.refresh();
            })();
        });
    };

    const handleReview = () => {
        const numericRating = Number(rating);
        if (Number.isNaN(numericRating) || numericRating < 1) {
            toast.error("Please provide a rating between 1 and 5.");
            return;
        }

        const toastId = toast.loading("Submitting review...");

        startTransition(() => {
            void (async () => {
                const result = await createReview({
                    booking_id: booking.booking_id,
                    tutor_profile_id: booking.tutor_profile_id,
                    rating: Math.min(5, Math.max(1, numericRating)),
                    comment: comment.trim() ? comment.trim() : null,
                });
                if (result?.error) {
                    toast.error(result.error.message, { id: toastId });
                    return;
                }
                toast.success("Attended and Review submitted", { id: toastId });
                setReviewOpen(false);
                setComment("");
                setRating("5");
                router.refresh();
            })();
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2 text-sm">
            <Sheet open={isReviewOpen} onOpenChange={setReviewOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="default"
                        size="sm"
                        disabled={!isConfirmed || isPending}
                    >
                        Mark attended
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Leave a review</SheetTitle>
                        <SheetDescription>
                            Share feedback for this session and help improve
                            tutoring quality.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 px-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Rating
                            </label>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <select
                                    value={rating}
                                    onChange={(event) =>
                                        setRating(event.target.value)
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <option
                                            key={value}
                                            value={value.toString()}
                                        >
                                            {value} stars
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Comment (optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(event) =>
                                    setComment(event.target.value)
                                }
                                placeholder="Share what went well..."
                                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            type="button"
                            onClick={handleReview}
                            disabled={isPending}
                        >
                            {isPending ? "Submitting..." : "Complete"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Button
                variant="destructive"
                size="sm"
                disabled={!isConfirmed || isPending || isCancelled}
                onClick={handleCancel}
            >
                Cancel booking
            </Button>
        </div>
    );
}

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "booking_id",
        header: "Booking ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.booking_id}</span>
        ),
    },
    {
        id: "subject",
        header: "Subject",
        cell: ({ row }) => <span>{row.original.subject?.name || "N/A"}</span>,
    },
    {
        id: "schedule",
        header: "Schedule",
        cell: ({ row }) => (
            <div className="flex flex-col text-sm">
                <span className="font-medium">{row.original.day_of_week}</span>
                <span className="text-xs text-muted-foreground">
                    {formatTime(row.original.start_time)} -{" "}
                    {formatTime(row.original.end_time)}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={getStatusVariant(row.original.status)}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">
                    {Number(row.original.price).toFixed(2)}
                </span>
            </div>
        ),
    },
    {
        id: "meeting",
        header: "Meeting Link",
        cell: ({ row }) =>
            row.original.meeting_link ? (
                <Link
                    href={row.original.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                >
                    <ExternalLink className="h-4 w-4" />
                    Join
                </Link>
            ) : (
                <span className="text-muted-foreground">N/A</span>
            ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                    {new Date(row.original.created_at).toLocaleDateString()}
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell booking={row.original} />,
    },
];
