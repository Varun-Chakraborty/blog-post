import { profileActions } from '@/redux/profile';
import { useAppDispatch, useAppSelector } from './redux';
import { useEffect, useState } from 'react';
import { Profile } from '@/types';
import { createSelector } from 'reselect';
import { RootState } from '@/redux';

function useLoadProfiles() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('profiles') ?? '[]');
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
  const selectProfiles = createSelector(
    (state: RootState) => state.profile.profiles,
    profiles => profiles.filter(profile => !profile.guest)
  );

  const profiles = useAppSelector(selectProfiles) || [];

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles, loading]);
}

export function useProfile() {
  const loading = useLoadProfiles();
  useSaveProfiles(loading);
}
