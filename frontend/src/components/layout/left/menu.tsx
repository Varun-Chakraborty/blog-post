import { MdDashboard, MdHome, MdVerifiedUser } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const options = [
  { icon: MdHome, title: "Home", route: "/" },
  { icon: MdDashboard, title: "Dashboard", route: "/dashboard" },
  { icon: IoCreate, title: "Create Post", route: "/post/create" },
  { icon: MdVerifiedUser, title: "Profile", route: "/profile" },
];

export function Menu({
  setMenuOpen,
  className,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "h-[65%] w-full box-border rounded-lg overflow-y-auto space-y-1",
        className
      )}
    >
      {options.map((option, i) => (
        <div
          key={i}
          onClick={() => {
            navigate(option.route);
            setMenuOpen(false);
          }}
          className="cursor-pointer p-3 m-3 rounded-lg flex items-center gap-2 hover:bg-primary/10 dark:hover:bg-primary/30"
        >
          <option.icon className="w-6 h-6" />
          <span>{option.title}</span>
        </div>
      ))}
    </div>
  );
}
