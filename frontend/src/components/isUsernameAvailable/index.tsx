import { MdCheck } from "react-icons/md";
import { InfiniteLoader } from "../loaders";
import { RxCross1 } from "react-icons/rx";
import { cn } from "@/lib/utils";
import api from "@/api";
import { useEffect, useState } from "react";
import { Tooltip } from "../tooltip";
import { UseFormSetError, UseFormTrigger } from "react-hook-form";

interface Props {
  trigger: UseFormTrigger<{
    name: string;
    username: string;
    email: string;
    password: string;
  }>;
  setError: UseFormSetError<{
    name: string;
    username: string;
    email: string;
    password: string;
  }>;
  username: string;
  className?: string;
}

export function IsUsernameAvailable({
  trigger,
  setError,
  username,
  className,
}: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | undefined
  >(true);

  const renderLoader = isLoading ? <InfiniteLoader /> : null;
  const renderUsernameAvailable = isUsernameAvailable !== undefined ? (
    <>
      {isUsernameAvailable ? (
        <MdCheck
          className={cn("text-success", {
            hidden: !isUsernameAvailable,
          })}
        />
      ) : (
        <RxCross1
          className={cn("text-error", {
            hidden: !isUsernameAvailable,
          })}
        />
      )}
    </>
  ) : null;

  useEffect(() => {
    setIsLoading(true);
    let timeout: NodeJS.Timeout | undefined;
    timeout = setTimeout(() => {
      (async function () {
        try {
          if (!username) return setIsUsernameAvailable(undefined);
          const isValid = await trigger("username");
          if (!isValid) return setIsUsernameAvailable(undefined);
          else {
            const isAvailable = await api.isUsernameAvailable(username);
            setIsUsernameAvailable(isAvailable);
            if (!isAvailable)
              setError("username", { message: "Not Available" });
          }
        } finally {
          setIsLoading(false);
        }
      })();
    }, 1000);
    return () => timeout && clearTimeout(timeout);
  }, [username]);

  return (
    <Tooltip
      tooltipContent={isUsernameAvailable ? "Available" : "Not Available"}
      className="absolute -top-9 -right-7 text-nowrap"
    >
      <div className={cn("h-4 rounded-full pl-2", className)}>
        {renderLoader ?? renderUsernameAvailable}
      </div>
    </Tooltip>
  );
}