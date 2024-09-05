import { CiBellOn, CiChat1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { SearchBar } from "@/components/searchBar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const pages: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/post/create": "Create Post",
  "/messages": "Messages",
  "/notifications": "Notifications",
  "/search": "Search",
  "/post": "Show Post",
  "/settings": "Settings",
};

export function RightPanel({
  isMenuOpen,
  setMenuOpen,
}: {
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const currentPage = pages[window.location.pathname];
  return (
    <div className="h-full xl:w-5/6 lg:4/5 sm:2/3 w-full p-2 flex flex-col gap-4">
      <div className="flex justify-between items-center select-none">
        <div className={cn("text-2xl font-montserrat sm:block hidden")}>
          {currentPage}
        </div>
        <Logo
          isMenuOpen={isMenuOpen}
          setMenuOpen={setMenuOpen}
          className="sm:hidden"
        />
        <div className="flex sm:gap-4 gap-2 items-center">
          <SearchBar />
          <div
            className="p-2 border border-borderColor rounded cursor-pointer hover:bg-primary/10 relative"
            onClick={() => navigate("/notifications")}
          >
            <CiBellOn className="aspect-square sm:h-6 w-5" />
            <div className="w-2 h-2 bg-accent rounded-full absolute -top-1 -right-1"></div>
          </div>
          <div
            className="p-2 border border-borderColor rounded cursor-pointer hover:bg-primary/10 relative"
            onClick={() => navigate("/messages")}
          >
            <CiChat1 className="aspect-square sm:h-6 w-5" />
            <div className="w-2 h-2 bg-accent rounded-full absolute -top-1 -right-1"></div>
          </div>
        </div>
      </div>

      <div className="bg-card h-full w-full xl:rounded-[40px] lg:rounded-[30px] md:rounded-[20px] sm:rounded-[10px] rounded-[5px] p-6 shadow-lg overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
