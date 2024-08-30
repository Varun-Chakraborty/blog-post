import { cn } from "@/lib/utils";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export function Logo({
  isMenuOpen,
  setMenuOpen,
  className,
}: {
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "font-montserrat text-xl font-bold flex gap-4 p-2 items-center",
        className
      )}
    >
      <RxHamburgerMenu
        className={cn(
          "w-5 h-5 transition sm:hidden",
          isMenuOpen ? "rotate-90" : ""
        )}
        onClick={() => setMenuOpen(!isMenuOpen)}
      />
      <span onClick={() => navigate("/")} className="cursor-pointer">Blog Post</span>
    </div>
  );
}
