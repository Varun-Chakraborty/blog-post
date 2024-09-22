import { cn } from "@/lib/utils";

export function Settings({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("h-full w-full box-border", className)}></div>
  );
}
