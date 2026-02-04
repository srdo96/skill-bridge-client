"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { BanIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "Action",
        header: "Action",
        cell: ({ row }) => {
            const router = useRouter();
            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            router.push(
                                `/admin/admin-dashboard/users-management/${row.original.id}`,
                            );
                        }}
                    >
                        <EyeIcon className="w-4 h-4" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            router.push(
                                `/admin/admin-dashboard/users-management/${row.original.id}`,
                            );
                        }}
                    >
                        <BanIcon className="w-4 h-4" />
                        {row.original.status === "active"
                            ? "Ban User"
                            : "Unban User"}
                    </Button>
                </div>
            );
        },
    },
];
