import {
  TooltipContent,
  TooltipProvider,
  Tooltip as TooltipShadcn,
  TooltipTrigger,
} from "./ui/tooltip";

export function Tooltip({
  tooltipContent,
  children,
  className
}: {
  tooltipContent: string;
  children: React.ReactNode;
  className?: string
}) {
  return (
    <TooltipProvider>
      <TooltipShadcn>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className={className}>{tooltipContent}</TooltipContent>
      </TooltipShadcn>
    </TooltipProvider>
  );
}
