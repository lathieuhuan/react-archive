import { useContext, useSyncExternalStore } from "react";
import { TFormStore, FormStoreContext, TFormStoreReturnType } from "./form-store-provider";

function useFormStore<K>(): [TFormStore<K>, (value: Partial<TFormStore<K>>) => void];

function useFormStore<K, T>(selector: (store: TFormStore<K>) => T): [T, (value: Partial<TFormStore<K>>) => void];

function useFormStore<K, T>(
  selector?: (store: TFormStore<K>) => T
): [TFormStore<K> | T, (value: Partial<TFormStore<K>>) => void] {
  const store = useContext(FormStoreContext) as TFormStoreReturnType<K>;

  const state = useSyncExternalStore(store.subscribe, () => (selector ? selector(store.get()) : store.get()));

  return [state, store.set];
}

export { useFormStore };
