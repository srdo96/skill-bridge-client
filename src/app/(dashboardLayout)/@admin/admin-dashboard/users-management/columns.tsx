"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BanIcon, EyeIcon, Loader2, Star as StarIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { setTutorFeatured } from "@/actions/tutor-profile.action";
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
    const [isFeatureLoading, setIsFeatureLoading] = useState(false);
    const isTutor = user.role === UserRoles.TUTOR;
    const tutorProfile = user.tutorProfiles ?? null;
    const isFeatured = tutorProfile?.is_featured ?? false;

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

    const handleToggleFeatured = async () => {
        if (!tutorProfile?.tutor_profile_id) {
            toast.error("Tutor profile not found");
            return;
        }

        const nextFeatured = !isFeatured;
        setIsFeatureLoading(true);

        const updatedTutorProfile = {
            ...tutorProfile,
            is_featured: nextFeatured,
        };
        updateRow(rowIndex, { tutorProfiles: updatedTutorProfile });

        try {
            const result = await setTutorFeatured(
                tutorProfile.tutor_profile_id,
                nextFeatured,
            );
            if (result?.error) {
                updateRow(rowIndex, { tutorProfiles: tutorProfile });
                toast.error(result.error.message);
            } else {
                toast.success(
                    nextFeatured
                        ? "Tutor featured successfully"
                        : "Tutor unfeatured successfully",
                );
            }
        } catch {
            updateRow(rowIndex, { tutorProfiles: tutorProfile });
            toast.error("Something went wrong");
        } finally {
            setIsFeatureLoading(false);
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
            {isTutor && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFeatured}
                    disabled={isFeatureLoading}
                >
                    {isFeatureLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                        <StarIcon className="w-4 h-4 mr-1" />
                    )}
                    {isFeatured ? "Unfeature" : "Feature"}
                </Button>
            )}
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
        accessorKey: "tutorProfiles.is_featured",
        header: "Featured",
        cell: ({ row }) => {
            const is_Featured = row.original.tutorProfiles?.is_featured;
            const role = row.original.role;
            return (
                <Badge variant={is_Featured === true ? "success" : "default"}>
                    {role === UserRoles.TUTOR && is_Featured === true
                        ? "Yes"
                        : ""}
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
