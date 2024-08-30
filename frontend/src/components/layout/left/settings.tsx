import api from "@/api";
import { useToast } from "@/components/ui/use-toast";
import { checkIfCurrentIsGuestProfile } from "@/hooks/checkIfCurrentIsGuestProfile";
import { useAppDispatch } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { profileActions } from "@/redux/profile";
import { AxiosError } from "axios";
import { CiDark, CiLight, CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
export function Settings({
  setMenuOpen,
  className,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isItGuest = checkIfCurrentIsGuestProfile();
  const { toast } = useToast();
  return (
    <div
      className={cn("h-[30%] w-full p-2 space-y-2 overflow-y-auto", className)}
    >
      <button
        onClick={() => {
          navigate("/settings");
          setMenuOpen(false);
        }}
        className="w-full cursor-pointer p-3 rounded-lg flex items-center gap-2 hover:bg-primary/30"
      >
        <CiSettings className="w-6 h-6" />
        Settings
      </button>
      <button
        className="w-full cursor-pointer p-3 rounded-lg flex items-center gap-2 hover:bg-primary/30"
        onClick={() => {
          document.documentElement.classList.toggle("dark");
          localStorage.setItem(
            "theme",
            document.documentElement.classList.contains("dark")
              ? "dark"
              : "light"
          );
        }}
      >
        <CiDark className="w-6 h-6 block dark:hidden" />
        <CiLight className="w-6 h-6 hidden dark:block" />
        <span className="text-sm block dark:hidden">Dark Mode</span>
        <span className="text-sm hidden dark:block">Light Mode</span>
      </button>
      {isItGuest ? (
        <button
          onClick={() => {
            navigate("/login");
            setMenuOpen(false);
          }}
          className="bg-accent hover:bg-accent/80 text-primaryText font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full"
        >
          Login
        </button>
      ) : (
        <button
          onClick={async function() {
            try {
              await api.logout();
              dispatch(profileActions.removeProfile());
              toast({
                title: "Success",
                description: "You have been logged out",
              })
            } catch (error) {
              if (error instanceof AxiosError && error.response?.status === 401) {
                dispatch(profileActions.removeProfile());
                toast({
                  title: "Success",
                  description: "You have been logged out",
                })
                return;
              } else {
                toast({
                  title: "Error",
                  description: (error as Error).message,
                  variant: "destructive",
                });
                console.error(error);
              }
            } finally {
              setMenuOpen(false);
            }
          }}
          className="bg-red-500 dark:bg-red-900 hover:bg-red-500/80 dark:hover:bg-red-900/80 text-primaryText font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full"
        >
          Logout
        </button>
      )}
    </div>
  );
}
