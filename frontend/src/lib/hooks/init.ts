import { useProfile } from './useProfile';
import { useFetchChats } from './useFetchChats';

export async function init() {
  useProfile();
  useFetchChats();
}
