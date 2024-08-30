import { cn } from "@/lib/utils";

export function Settings({ className }: { className?: string }) {
  return (
    <div className={cn("h-full w-full box-border", className)}></div>
  );
}
