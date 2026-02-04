"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BanIcon, EyeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { banUser, unbanUser } from "@/actions/user.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, UserRoles, UserStatus } from "@/types";
import { DataTableMeta } from "./data-table";

// Action cell component with loading state and optimistic update
function ActionCell({
    user,
    rowIndex,
    updateRow,
}: {
    user: User;
    rowIndex: number;
    updateRow: (rowIndex: number, newData: Partial<User>) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBanUser = async () => {
        const currentStatus = user.status;
        const newStatus =
            currentStatus === UserStatus.ACTIVE
                ? UserStatus.BAN
                : UserStatus.ACTIVE;

        setIsLoading(true);

        // Optimistic update - update UI immediately
        updateRow(rowIndex, { status: newStatus });

        try {
            if (currentStatus === UserStatus.BAN) {
                const result = await unbanUser(user.id);
                if (result?.error) {
                    // Revert on error
                    updateRow(rowIndex, { status: currentStatus });
                    toast.error(result.error.message);
                } else {
                    toast.success("User unbanned successfully");
                }
            } else {
                const result = await banUser(user.id);
                if (result?.error) {
                    // Revert on error
                    updateRow(rowIndex, { status: currentStatus });
                    toast.error(result.error.message);
                } else {
                    toast.success("User banned successfully");
                }
            }
        } catch {
            // Revert on error
            updateRow(rowIndex, { status: currentStatus });
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/admin-dashboard/users-management/${user.id}`}>
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                </Link>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleBanUser}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                    <BanIcon className="w-4 h-4 mr-1" />
                )}
                {user.status === UserStatus.ACTIVE ? "Ban" : "Unban"}
            </Button>
        </div>
    );
}

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
        cell: ({ row, table }) => {
            const user = row.original;
            const meta = table.options.meta as DataTableMeta<User>;

            return (
                <ActionCell
                    user={user}
                    rowIndex={row.index}
                    updateRow={meta.updateRow}
                />
            );
        },
    },
];
