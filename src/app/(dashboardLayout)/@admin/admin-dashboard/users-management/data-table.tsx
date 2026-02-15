"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { DataTablePagination } from "@/components/layout/data-table-pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/layout/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
};

export function DataTable<TData, TValue>({
    columns,
    data: initialData,
    serverPagination,
}: DataTableProps<TData, TValue>) {
    console.log("serverPagination", serverPagination);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [data, setData] = useState(initialData);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: serverPagination?.limit ?? 10,
    });
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
        } as DataTableMeta<TData>,
    });

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
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
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
                        ))
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
