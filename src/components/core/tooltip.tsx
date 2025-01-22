import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface ICustomTooltipProps {
  trigger: React.ReactNode;
  triggerAsChild?: boolean;
  content: React.ReactNode;
  contentAsChild?: boolean;
  contentWrapperClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  maxWidth?: string; // Option to control max-width of the tooltip
}

export default function CustomTooltip({
  trigger,
  triggerAsChild = false,
  content,
  contentAsChild = false,
  contentWrapperClassName = "",
  side = "top",
  align = "center",
  maxWidth = "200px", // Default max-width if not provided
}: ICustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={triggerAsChild}>{trigger}</TooltipTrigger>
      <TooltipContent
        asChild={contentAsChild}
        className={`${contentWrapperClassName} max-w-[${maxWidth}] overflow-visible whitespace-normal break-words`}
        side={side}
        align={align}
      >
        <TooltipPrimitive.Arrow height={6.5} />
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
