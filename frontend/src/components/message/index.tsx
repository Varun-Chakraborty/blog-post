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
      className="fixed bottom-0 right-3 lg:w-[18%] sm:w-[30%] bg-black z-50 rounded-t-lg text-white sm:block hidden select-none"
    >
      <div
        className="flex justify-between items-center cursor-pointer p-3 rounded-t-lg"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 aspect-square bg-sky-600 rounded-full"></div>
          <span className="text-lg">Messages</span>
        </div>
        <div className="p-2 hover:bg-gray-700 rounded-full">
          <IoChevronDown
            className={cn("w-4 h-4 transition", expanded && "rotate-180")}
          />
        </div>
      </div>
      <div className={cn("transition-all", !expanded ? "h-0" : "h-fit")}>
        <div className="py-2 px-3 space-y-2">
          {messages.map((message, i) => (
            <div
              key={i}
              className="flex items-start gap-4 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
            >
              <img
                src={message.profile}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="">
                <div className="font-semibold">{message.name}</div>
                <div className="text-sm text-white/80">{message.message}</div>
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
    profile: "/placeholder-user.jpg",
    name: "John Doe",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    profile: "/placeholder-user.jpg",
    name: "John Doe",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
