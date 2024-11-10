import { profileActions } from '@/redux/profile';
import { useAppDispatch, useAppSelector } from './redux';
import { useEffect, useState } from 'react';
import { userService } from '@/services';
import { isGuestProfile } from './isGuestProfile';

function useLoadUserProfiles() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (!profile) {
      setLoading(false);
      return;
    } else {
      const profileObj = JSON.parse(profile);
      dispatch(profileActions.setProfile(profileObj));
      setLoading(false);
    }
  }, []);
  return loading;
}

function useSaveUserProfiles(loading: boolean) {
  const { profile } = useAppSelector(state => state.profile);

  useEffect(() => {
    if (!loading) localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile, loading]);
}

export function useUserProfile() {
  const loading = useLoadUserProfiles();
  useSaveUserProfiles(loading);
  const dispatch = useAppDispatch();
  const isItGuest = isGuestProfile();

  useEffect(() => {
    if (!isItGuest) {
      userService.getProfileSummary().then(profileSummary => {
        dispatch(profileActions.setProfile(profileSummary));
      });
    }
  }, []);
}
