import api from "@/api";
import { InfiniteLoader } from "@/components/loaders";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import { profileActions } from "@/redux/profile";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profile as ProfileType } from "@/types";

export function Profile({ className }: { className?: string }) {
  const [profile, setProfile] = useState<ProfileType | undefined>(undefined);
  const { toast } = useToast();
  const userNameRequested = new URLSearchParams(window.location.search).get(
    "username"
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .getProfile(userNameRequested)
      .then((profile) => {
        setProfile(profile);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            toast({
              title: "Session expired",
              description: "Please login again.",
            });
            dispatch(profileActions.removeProfile());
            navigate("/login");
          }
          toast({
            title: "Could not get profile",
            description: err.response?.data.message || "Unknown error occured",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Could not get profile",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
          console.error(err);
          return {};
        }
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className={cn("h-full w-full box-border", className)}>
      {loading ? (
        <InfiniteLoader className="h-full w-full" />
      ) : profile ? (
        JSON.stringify(profile)
      ) : (
        <>No profile found</>
      )}
    </div>
  );
}
