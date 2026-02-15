"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

import { DataTablePagination } from "@/components/layout/data-table-pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/layout/table";
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    serverPagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Context to share updateData function with cells
export type DataTableMeta<TData> = {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    updateRow: (rowIndex: number, newData: Partial<TData>) => void;
    toggleExpanded: (rowId: string) => void;
    isExpanded: (rowId: string) => boolean;
};

export function DataTable<TData, TValue>({
    columns,
    data: initialData,
    serverPagination,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState(initialData);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: Math.max((serverPagination?.page ?? 1) - 1, 0),
        pageSize: serverPagination?.limit ?? 10,
    });
    const [expandedRows, setExpandedRows] = useState<Set<string>>(
        () => new Set(),
    );
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handlePageChange = (page: number) => {
        if (!serverPagination) return;
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.set("page", String(page));
        params.set("limit", String(serverPagination.limit));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageSizeChange = (pageSize: number) => {
        if (!serverPagination) return;
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.set("page", "1");
        params.set("limit", String(pageSize));
        router.push(`${pathname}?${params.toString()}`);
    };

    const toggleExpanded = (rowId: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }
            return next;
        });
    };

    const isExpanded = (rowId: string) => expandedRows.has(rowId);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        meta: {
            updateData: (
                rowIndex: number,
                columnId: string,
                value: unknown,
            ) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...row,
                                [columnId]: value,
                            };
                        }
                        return row;
                    }),
                );
            },
            updateRow: (rowIndex: number, newData: Partial<TData>) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...row,
                                ...newData,
                            };
                        }
                        return row;
                    }),
                );
            },
            toggleExpanded,
            isExpanded,
        } as DataTableMeta<TData>,
    });

    const columnCount = useMemo(() => columns.length, [columns.length]);

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const rowId =
                                (row.original as { category_id?: string })
                                    .category_id ?? row.id;
                            const subjects =
                                (
                                    row.original as {
                                        subjects?: {
                                            subject_id: string;
                                            name: string;
                                        }[];
                                    }
                                ).subjects ?? [];

                            return (
                                <Fragment key={row.id}>
                                    <TableRow
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {isExpanded(rowId) && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columnCount}
                                                className="bg-muted/30"
                                            >
                                                <div className="flex flex-wrap gap-2">
                                                    {subjects.length > 0 ? (
                                                        subjects.map(
                                                            (subject) => (
                                                                <Badge
                                                                    key={
                                                                        subject.subject_id
                                                                    }
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {
                                                                        subject.name
                                                                    }
                                                                </Badge>
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No subjects
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DataTablePagination
                table={table}
                page={serverPagination?.page}
                totalPages={serverPagination?.totalPages}
                pageSize={serverPagination?.limit}
                onPageChange={serverPagination ? handlePageChange : undefined}
                onPageSizeChange={
                    serverPagination ? handlePageSizeChange : undefined
                }
            />
        </div>
    );
}
