import { cn } from "@/lib/utils";

export function Dashboard({ className }: { className?: string }) {
  return (
    <div className={cn("h-full w-full box-border", className)}>
      Dashboard
    </div>
  );
}
