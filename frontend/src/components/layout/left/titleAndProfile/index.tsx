import { Profile } from "./profile";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export function TitleAndUser({ isMenuOpen, setMenuOpen, className }: { isMenuOpen: boolean, setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>, className?: string }) {
  return (
    <div className={cn("h-[25%] w-full px-2 py-3 space-y-6", className)}>
      <Logo isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      <Profile />
    </div>
  );
}
