import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function Login({
  setMenuOpen,
  className,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/login");
        setMenuOpen(false);
      }}
      className={cn(
        "bg-accent hover:bg-accent/80 text-primaryText font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full",
        className
      )}
    >
      Login
    </button>
  );
}
