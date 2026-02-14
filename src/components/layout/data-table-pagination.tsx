"use client";

import { Table as TanstackTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
    table: TanstackTable<TData>;
    pageSizeOptions?: number[];
    page?: number;
    totalPages?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
    table,
    pageSizeOptions = [5, 10, 20, 50],
    page,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps<TData>) {
    const currentPage = page ?? table.getState().pagination.pageIndex + 1;
    const currentTotalPages = totalPages ?? Math.max(table.getPageCount(), 1);
    const currentPageSize = pageSize ?? table.getState().pagination.pageSize;
    const canPrevious = onPageChange
        ? currentPage > 1
        : table.getCanPreviousPage();
    const canNext = onPageChange
        ? currentPage < currentTotalPages
        : table.getCanNextPage();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2 text-sm">
                <span>Rows per page</span>
                <select
                    className="rounded-md border bg-background px-2 py-1 text-sm"
                    value={currentPageSize}
                    onChange={(event) => {
                        const nextSize = Number(event.target.value);
                        if (onPageSizeChange) {
                            onPageSizeChange(nextSize);
                            return;
                        }
                        table.setPageSize(nextSize);
                    }}
                >
                    {pageSizeOptions.map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {currentTotalPages}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (onPageChange) {
                            onPageChange(1);
                            return;
                        }
                        table.firstPage();
                    }}
                    disabled={!canPrevious}
                >
                    First
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (onPageChange) {
                            onPageChange(currentPage - 1);
                            return;
                        }
                        table.previousPage();
                    }}
                    disabled={!canPrevious}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (onPageChange) {
                            onPageChange(currentPage + 1);
                            return;
                        }
                        table.nextPage();
                    }}
                    disabled={!canNext}
                >
                    Next
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (onPageChange) {
                            onPageChange(currentTotalPages);
                            return;
                        }
                        table.lastPage();
                    }}
                    disabled={!canNext}
                >
                    Last
                </Button>
            </div>
        </div>
    );
}
