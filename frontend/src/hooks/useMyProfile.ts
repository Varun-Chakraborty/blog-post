import { useAppSelector } from './redux';

export function useMyProfile() {
  const { profiles, currentProfile } = useAppSelector(state => state.profile);
  const profile = profiles.find(profile => profile.id === currentProfile);
  if (profile && profile.id !== '0') {
    return profile;
  }
}
