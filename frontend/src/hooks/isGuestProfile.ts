import { useAppSelector } from './redux';

export function isGuestProfile() {
  const profiles = useAppSelector(state => state.profile.profiles);
  const isItGuest =
    profiles.length === 1 && profiles.some(profile => profile.guest);
  return isItGuest;
}
