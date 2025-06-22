import { useUserProfile } from './useUserProfile';
import { useFetchChats } from './useFetchChats';

export async function init() {
  useUserProfile();
  useFetchChats();
}
