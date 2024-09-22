import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

export function FloatingMessage() {
  const [expanded, setExpanded] = useState(false);
  const currentComponent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currentComponent.current &&
        !currentComponent.current.contains(event.target as HTMLDivElement)
      ) {
        setExpanded(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
  return (
    <div
      ref={currentComponent}
      className="fixed bottom-0 right-3 lg:w-[18%] sm:w-[30%] bg-background z-50 rounded-t-lg sm:block hidden select-none"
    >
      <button
        className="flex justify-between items-center cursor-pointer p-3 rounded-t-lg w-full"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 aspect-square bg-accent rounded-full"></div>
          <span className="text-lg">Messages</span>
        </div>
        <div className="p-2 hover:bg-primary/10 rounded-full">
          <IoChevronDown
            className={cn("w-4 h-4 transition", expanded && "rotate-180")}
          />
        </div>
      </button>
      <div className={cn("transition-all", !expanded ? "h-0" : "h-fit")}>
        <div className="py-2 px-3 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-4 hover:bg-primary/10 p-2 rounded-lg cursor-pointer"
            >
              <img src={message.pfp} alt="" className="w-8 h-8 rounded-full" />
              <div className="">
                <div className="font-semibold">{message.name}</div>
                <div className="text-sm">{message.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const messages = [
  {
    id: 1,
    pfp: "/placeholder-user.jpg",
    name: "John Doe",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    pfp: "/placeholder-user.jpg",
    name: "John Doe",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
