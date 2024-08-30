import { cn } from "@/lib/utils";

export function Messages({ className }: { className?: string }) {
  return (
    <div className={cn("h-full w-full box-border", className)}>
      Messages
    </div>
  );
}
