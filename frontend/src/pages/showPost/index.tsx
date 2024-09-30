import { cn } from "@/lib/utils";

export function ShowPost({ className }: Readonly<{ className?: string }>) {
  const id = new URLSearchParams(window.location.search).get("id");
  return (
    <div className={cn("h-full w-full box-border", className)}>
      Show Post {id}
    </div>
  );
}
