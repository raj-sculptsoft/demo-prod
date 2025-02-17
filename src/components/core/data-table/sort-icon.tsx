import Arrow from "@/assets/icons/arrow";
import { useAppSelector } from "@/hooks/use-store";

const SortIcon = ({ column }: { column: string }) => {
  const { sorting } = useAppSelector(({ common }) => common.dataTable);
  const isActive = sorting.column === column;

  return (
    <Arrow
      className={`h-4 w-4 flex-none shrink-0 transition-transform ${
        isActive ? (sorting.direction === "asc" ? "rotate-180" : "") : ""
      }`}
    />
  );
};

export default SortIcon;
