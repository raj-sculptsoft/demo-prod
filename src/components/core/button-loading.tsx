import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function ButtonLoading({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button
      disabled
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Loader2 className="h-4 animate-spin" />
      {label}
    </Button>
  );
}
