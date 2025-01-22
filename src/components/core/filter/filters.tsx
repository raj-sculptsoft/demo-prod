import { cn } from "../../../lib/utils";

export default function Filter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex rounded-lg border bg-white", className)}>
      {children}
    </div>
  );
}
