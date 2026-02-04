"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BanIcon, EyeIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, UserRoles, UserStatus } from "@/types";

export const columns: ColumnDef<User>[] = [
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
        cell: ({ row }) => {
            const role = row.original.role;
            const variant =
                role === UserRoles.ADMIN
                    ? "destructive"
                    : role === UserRoles.TUTOR
                      ? "default"
                      : "secondary";
            return <Badge variant={variant}>{role}</Badge>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={
                        status === UserStatus.ACTIVE ? "success" : "destructive"
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            href={`/admin-dashboard/users-management/${user.id}`}
                        >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                        <BanIcon className="w-4 h-4 mr-1" />
                        {user.status === UserStatus.ACTIVE ? "Ban" : "Unban"}
                    </Button>
                </div>
            );
        },
    },
];
