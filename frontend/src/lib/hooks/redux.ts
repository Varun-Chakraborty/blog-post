import { store } from '@/lib/redux';
import { useSelector, useDispatch } from 'react-redux';

export function useAppDispatch() {
  return useDispatch<typeof store.dispatch>();
}

export function useAppSelector<T>(
  selector: (state: ReturnType<typeof store.getState>) => T
) {
  return useSelector(selector);
}
