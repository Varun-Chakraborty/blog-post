import { Profile } from "./profile";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface Props {
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function TitleAndUser({ isMenuOpen, setMenuOpen, className }: Readonly<Props>) {
  return (
    <div className={cn("w-full space-y-6", className)}>
      <Logo isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      <Profile />
    </div>
  );
}
