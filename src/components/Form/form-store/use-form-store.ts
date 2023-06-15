import { useContext, useSyncExternalStore } from 'react';
import { TFormStore, FormStoreContext } from './form-store-provider';

function useFormStore(): [TFormStore, (value: Partial<TFormStore>) => void];

function useFormStore<T>(selector: (store: TFormStore) => T): [T, (value: Partial<TFormStore>) => void];

function useFormStore<T>(selector?: (store: TFormStore) => T): [TFormStore | T, (value: Partial<TFormStore>) => void] {
    const store = useContext(FormStoreContext);

    const state = useSyncExternalStore(store.subscribe, () => (selector ? selector(store.get()) : store.get()));

    return [state, store.set];
}

export { useFormStore };
