import { useAppSelector } from './redux';

export function isGuestProfile() {
  const profile = useAppSelector(state => state.profile.profile);
  return profile.guest;
}
