import { createContext, useCallback, useRef } from "react";

export type TFormStore<K> = K & Record<PropertyKey, unknown>;

function useFormStoreData<K>(initialValues: Partial<TFormStore<K>> = {}): {
  get: () => TFormStore<K>;
  set: (value: Partial<TFormStore<K>>) => void;
  subscribe: (callback: () => void) => () => void;
} {
  const formStore = useRef<TFormStore<K>>(initialValues as TFormStore<K>);
  const subscribers = useRef(new Set<() => void>());

  const get = useCallback(() => formStore.current, []);

  const set = useCallback((value: Partial<TFormStore<K>>) => {
    formStore.current = {
      ...formStore.current,
      ...value,
    };

    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);

    return () => subscribers.current.delete(callback);
  }, []);

  return {
    get,
    set,
    subscribe,
  };
}

export type TFormStoreReturnType<K> = ReturnType<typeof useFormStoreData<K>>;

export const FormStoreContext = createContext<TFormStoreReturnType<any>>({
  get: () => ({}),
  set: () => undefined,
  subscribe: () => () => undefined,
});

interface IFormStoreProviderProps<K> {
  children: React.ReactNode;
  initialValues?: Partial<TFormStore<K>>;
  onSubmit?: (data: TFormStore<K>) => void;
}

export function FormStoreProvider<K>({ children, initialValues, onSubmit }: IFormStoreProviderProps<K>) {
  const storeData = useFormStoreData<K>(initialValues);

  return (
    <FormStoreContext.Provider value={storeData}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(storeData.get());
        }}
      >
        {children}
      </form>
    </FormStoreContext.Provider>
  );
}
