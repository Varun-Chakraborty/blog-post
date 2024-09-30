import { cn } from "@/lib/utils";

export function Messages({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("h-full w-full box-border", className)}>
      Messages
    </div>
  );
}
