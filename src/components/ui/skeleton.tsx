import { cn } from "@/lib/utils";

function Skeleton({
  className,
  isLoadingText = false, // Add a prop to show a loading text (optional)
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { isLoadingText?: boolean }) {
  return (
    <div
      className={cn(
        "relative animate-pulse rounded-md bg-slate-200 dark:bg-slate-800",
        className,
      )}
      {...props}
    >
      {isLoadingText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg text-gray-800">Loading...</span>
        </div>
      )}
    </div>
  );
}

export { Skeleton };
