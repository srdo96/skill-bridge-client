"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, ChevronDown, ChevronRight, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { DataTableMeta } from "./data-table";

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">
                        ID: {row.original.category_id}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "desc",
        header: "Description",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground line-clamp-2">
                {row.original.desc || "N/A"}
            </span>
        ),
    },
    {
        id: "subjects",
        header: "Subjects",
        cell: ({ row }) => {
            const count = row.original.subjects?.length ?? 0;
            return (
                <Badge variant="secondary">
                    {count} {count === 1 ? "Subject" : "Subjects"}
                </Badge>
            );
        },
    },
    {
        id: "view",
        header: "View",
        cell: ({ row, table }) => {
            const rowId = row.original.category_id;
            const meta = table.options.meta as DataTableMeta<Category>;
            const expanded = meta.isExpanded(rowId);

            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => meta.toggleExpanded(rowId)}
                    className="h-7 px-2"
                >
                    {expanded ? (
                        <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                        <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                </Button>
            );
        },
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
