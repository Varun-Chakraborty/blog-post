import { cn } from "@/lib/utils";
import { TitleAndUser } from "./titleAndUser";
import { Menu } from "./menu";
import { Settings } from "./settings";
import React from "react";

interface LeftPanelProps {
  className?: string;
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LeftPanel({
  className,
  isMenuOpen,
  setMenuOpen,
}: Readonly<LeftPanelProps>): JSX.Element {
  return (
    <div
      className={cn(
        "h-full xl:w-1/6 lg:w-1/5 sm:w-1/3 w-full sm:static fixed flex flex-col justify-between transition-all px-0 sm:p-0 z-50 bg-background select-none",
        isMenuOpen ? "left-0" : "-left-full",
        className
      )}
    >
      <TitleAndUser
        isMenuOpen={isMenuOpen}
        setMenuOpen={setMenuOpen}
        className="h-[25%] p-2"
      />
      <hr className="border border-borderColor" />
      <Menu setMenuOpen={setMenuOpen} className="h-[70%]" />
      <hr className="border border-borderColor" />
      <Settings setMenuOpen={setMenuOpen} className="h-[25%]" />
    </div>
  );
}
