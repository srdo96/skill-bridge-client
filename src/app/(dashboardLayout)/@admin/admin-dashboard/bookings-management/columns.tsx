"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, DollarSign, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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
            return "default";
        case BookingStatus.COMPLETED:
            return "success";
        case BookingStatus.CANCELLED:
            return "destructive";
        default:
            return "outline";
    }
}

function shortId(id: string) {
    if (id.length <= 14) return id;
    return `${id.slice(0, 8)}...${id.slice(-8)}`;
}

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "booking_id",
        header: "Booking ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs" title={row.original.booking_id}>
                {shortId(row.original.booking_id)}
            </span>
        ),
    },
    {
        id: "student",
        header: "Student",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">
                    {row.original.student?.name || "Student"}
                </span>
                <span className="text-xs text-muted-foreground">
                    {row.original.student?.email || "N/A"}
                </span>
            </div>
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
        accessorKey: "updated_at",
        header: "Updated",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                    {new Date(row.original.updated_at).toLocaleDateString()}
                </span>
            </div>
        ),
    },
];
