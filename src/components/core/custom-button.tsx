import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export default function CustomButton({
  isLoading = false,
  children,
  className,
  disabled = false,
  ...rest
}: ButtonProps & {
  isLoading?: boolean;
}) {
  return (
    <Button
      disabled={isLoading || disabled}
      data-loading={isLoading}
      className={cn(
        "group relative select-none disabled:cursor-not-allowed disabled:opacity-50", // Updated disabled styles
        className,
      )}
      {...rest}
    >
      <span className="group-data-[loading=true]:text-transparent">
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle
            className="animate-spin"
            height={20}
            width={20}
            size={20}
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>
      )}
    </Button>
  );
}
