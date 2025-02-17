"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { setPage, setRowsPerPage } from "@/store/common/slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

interface IDataTableProps {
  headers: React.ReactNode;
  body: React.ReactNode;
  rowSkeleton: React.ReactNode;
  tableClassName?: string;
  noOfColumns: number;
  firstLoading?: boolean;
}

export default function DataTable({
  headers,
  body,
  rowSkeleton,
  tableClassName = "",
  noOfColumns = 4,
  firstLoading = true,
}: IDataTableProps) {
  const {
    rowsPerPage,
    page: currentPage,
    totalPages,
    data: { list, total_count },
    isLoading,
  } = useAppSelector(({ common }) => common.dataTable);

  const dispatch = useAppDispatch();

  // const displayPage = totalPages ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const displayPage = total_count > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;

  return (
    <>
      <Table className={cn("rounded-lg bg-white", tableClassName)}>
        <TableHeader>
          <TableRow className="select-none">{headers}</TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && firstLoading ? rowSkeleton : body}

          {!isLoading && !(list as unknown[])?.length ? (
            <TableRow>
              <TableCell colSpan={noOfColumns} className="h-16 text-center">
                No Data Found
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <div className="sticky bottom-0 z-20 flex items-center justify-between bg-[#F2F4F8] px-2 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              dispatch(setRowsPerPage(+value));
              dispatch(setPage(1));
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm font-bold">
          Showing data{" "}
          {isLoading && firstLoading
            ? "..."
            : `${displayPage} to ${Math.min(currentPage * rowsPerPage, total_count)}`}{" "}
          of {isLoading && firstLoading ? "..." : total_count} entries
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(setPage(Math.max(currentPage - 1, 1)))}
            disabled={currentPage === 1 || isLoading}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8">
            {currentPage}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              dispatch(setPage(Math.min(currentPage + 1, totalPages)))
            }
            disabled={
              currentPage === totalPages || isLoading || total_count === 0
            }
            className="h-8 w-8"
          >
            <ChevronRight className="h-9 w-9" />
          </Button>
        </div>
      </div>
    </>
  );
}
