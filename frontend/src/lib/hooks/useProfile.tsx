import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { userService } from "@/services";
import { profileActions } from "../redux/profile";

export function useProfile() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.profile);

  useEffect(() => {
    if (loading) {
      const stored = JSON.parse(localStorage.getItem('profiles') || '[]');
      stored != 'Guest' && userService.getProfileSummary(stored).then(profileSummary => {
          dispatch(profileActions.setLoggedIn(profileSummary));
        })
      setLoading(false);
    } else {
      localStorage.setItem('profiles', JSON.stringify(loggedIn.username));
    }
  }, [loading, loggedIn]);
}