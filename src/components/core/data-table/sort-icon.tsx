import Arrow from "@/assets/icons/arrow";
import { useAppSelector } from "@/hooks/use-store";

const SortIcon = ({ column }: { column: string }) => {
  const { sorting } = useAppSelector(({ common }) => common.dataTable);
  if (sorting.column !== column) return "";
  return sorting.direction !== "asc" ? (
    <Arrow key="up" />
  ) : (
    <Arrow key="down" className="rotate-180" />
  );
};

export default SortIcon;
