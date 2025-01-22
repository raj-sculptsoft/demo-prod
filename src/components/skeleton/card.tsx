import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function CardSkeleton({
  wrapperClassName = "gap-4 md:grid-cols-2 lg:grid-cols-4",
  cardCount = 4,
  cardClassName = "h-36 w-full",
}: {
  wrapperClassName?: string;
  cardCount?: number;
  cardClassName?: string;
}) {
  return (
    <div className={cn("grid", wrapperClassName)}>
      {new Array(cardCount).fill(0).map((_, index) => (
        <Skeleton key={index} className={cn("rounded-lg", cardClassName)} />
      ))}
    </div>
  );
}
