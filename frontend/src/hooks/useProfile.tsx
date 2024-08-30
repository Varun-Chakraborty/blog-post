import { profileActions } from "@/redux/profile";
import { useAppDispatch, useAppSelector } from "./redux";
import { useEffect, useState } from "react";
import { Profile } from "@/types";

function useLoadProfiles() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");
    if (profiles) {
      profiles.forEach((profile: Profile) => {
        dispatch(profileActions.addProfile(profile));
      });
    }
    setLoading(false);
  }, []);
  return loading;
}

function useSaveProfiles(loading: boolean) {
  const profiles =
    useAppSelector((state) =>
      state.profile.profiles.filter((profile) => !profile.guest)
    ) || [];

  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles, loading]);
}

export function useProfile() {
  const loading = useLoadProfiles();
  useSaveProfiles(loading);
}
