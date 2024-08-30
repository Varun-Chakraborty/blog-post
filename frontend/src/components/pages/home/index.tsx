import { cn } from "@/lib/utils";
import { Cards } from "./cards";

export function Home({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-full w-full box-border grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 overflow-y-auto",
        className
      )}
      style={{ gridTemplateRows: "min-content" }}
    >
      <Cards />
    </div>
  );
}
