import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAppSelector } from "@/hooks/use-store";

export default function RowSkeleton({
  noOfColumns = 4,
}: {
  noOfColumns?: number;
}) {
  const { rowsPerPage } = useAppSelector(({ common }) => common.dataTable);

  return Array.from({ length: parseInt(rowsPerPage.toString()) }).map(
    (_, rowIndex) => (
      <TableRow key={`skeleton-${rowIndex}`}>
        {Array.from({ length: noOfColumns }).map((_, columnIndex) => (
          <TableCell key={`column-skeleton-${columnIndex}`}>
            <Skeleton className="h-6" />
          </TableCell>
        ))}
      </TableRow>
    ),
  );
}
