import { store } from "@/redux";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useAppDispatch() {
  return useDispatch<typeof store.dispatch>();
}

export function useAppSelector<T>(
  selector: (state: ReturnType<typeof store.getState>) => T
) {
  return useSelector(selector);
}
