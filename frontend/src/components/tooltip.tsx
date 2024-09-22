import {
  TooltipContent,
  TooltipProvider,
  Tooltip as TooltipShadcn,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  tooltipContent: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  tooltipContent,
  children,
  className,
}: Readonly<Props>) {
  return (
    <TooltipProvider>
      <TooltipShadcn>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className={className}>{tooltipContent}</TooltipContent>
      </TooltipShadcn>
    </TooltipProvider>
  );
}
