import { HiHome, HiOutlineHome, HiUser, HiOutlineUser } from "react-icons/hi";
import { MdSpaceDashboard, MdOutlineSpaceDashboard } from "react-icons/md";
import {
  IoCreate,
  IoCreateOutline,
  IoSettings,
  IoSettingsOutline,
} from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { checkIfCurrentIsGuestProfile } from "@/hooks/checkIfCurrentIsGuestProfile";

const options = [
  {
    inActiveIcon: HiOutlineHome,
    activeIcon: HiHome,
    title: "Home",
    route: "/",
  },
  {
    inActiveIcon: MdOutlineSpaceDashboard,
    activeIcon: MdSpaceDashboard,
    title: "Dashboard",
    route: "/dashboard",
  },
  {
    inActiveIcon: IoCreateOutline,
    activeIcon: IoCreate,
    title: "Create Post",
    route: "/post/create",
    isProtected: true,
  },
  {
    inActiveIcon: HiOutlineUser,
    activeIcon: HiUser,
    title: "Profile",
    route: "/profile",
    isProtected: true,
  },
  {
    inActiveIcon: IoSettingsOutline,
    activeIcon: IoSettings,
    title: "Settings",
    route: "/settings",
  },
];

export function Menu({
  setMenuOpen,
  className,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const isGuestProfile = checkIfCurrentIsGuestProfile();
  return (
    <div
      className={cn(
        "w-full box-border rounded-lg overflow-y-auto space-y-1",
        className
      )}
    >
      {options
        .filter((option) => !option.isProtected || !isGuestProfile)
        .map((option, i) => (
          <NavLink
            key={i}
            to={option.route}
            onClick={() => setMenuOpen(false)}
            className={cn(
              "cursor-pointer p-3 m-3 rounded-lg flex items-center gap-2 hover:bg-primary/15 dark:hover:bg-primary/30"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive
                  ? option.activeIcon({ className: "w-6 h-6" })
                  : option.inActiveIcon({ className: "w-6 h-6" })}
                <span className={cn({ "font-semibold": isActive })}>
                  {option.title}
                </span>
              </>
            )}
          </NavLink>
        ))}
    </div>
  );
}
