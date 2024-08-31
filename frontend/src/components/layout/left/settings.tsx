import { LoginButton, LogoutButton, ThemeButton } from "@/components/buttons";
import { checkIfCurrentIsGuestProfile } from "@/hooks/checkIfCurrentIsGuestProfile";
import { cn } from "@/lib/utils";

export function Settings({
  setMenuOpen,
  className,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const isItGuest = checkIfCurrentIsGuestProfile();
  return (
    <div className={cn("w-full p-2 space-y-2 overflow-y-auto", className)}>
      <ThemeButton />
      {isItGuest ? (
        <LoginButton setMenuOpen={setMenuOpen} />
      ) : (
        <LogoutButton setMenuOpen={setMenuOpen} />
      )}
    </div>
  );
}
