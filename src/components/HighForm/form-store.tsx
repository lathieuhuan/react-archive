import { createContext, useCallback, useContext, useRef, useSyncExternalStore } from "react";

type FormStore = {
  activeGroupKeys: string[];
  disabledFields: Record<string, boolean>;
  accordionGroups: boolean;
};

const getDefaultFormStoreData = (defaultValues?: Partial<FormStore>) => {
  const { activeGroupKeys = [], accordionGroups = true, disabledFields = {} } = defaultValues || {};
  return { activeGroupKeys, accordionGroups, disabledFields };
};

const useFormStoreData = (
  defaultValues?: Partial<FormStore>
): {
  get: () => FormStore;
  set: (value: Partial<FormStore>) => void;
  subscribe: (callback: () => void) => () => void;
} => {
  const formStore = useRef(getDefaultFormStoreData(defaultValues));
  const subscribers = useRef(new Set<() => void>());

  const get = useCallback(() => formStore.current, []);

  const set = useCallback((value: Partial<FormStore>) => {
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
};

type FormStoreReturnType = ReturnType<typeof useFormStoreData>;

const FormStoreContext = createContext<FormStoreReturnType | null>(null);

interface IFormStoreProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<FormStore>;
}

const FormStoreProvider = ({ children, defaultValues }: IFormStoreProviderProps) => {
  const storeData = useFormStoreData(defaultValues);

  return <FormStoreContext.Provider value={storeData}>{children}</FormStoreContext.Provider>;
};

function useFormStore(): [FormStore, (value: Partial<FormStore>) => void];

function useFormStore<T>(selector: (store: FormStore) => T): [T, (value: Partial<FormStore>) => void];

function useFormStore<T>(selector?: (store: FormStore) => T): [FormStore | T, (value: Partial<FormStore>) => void] {
  const store = useContext(FormStoreContext);

  if (!store) {
    throw new Error("Store not found");
  }

  const state = useSyncExternalStore(store.subscribe, () => (selector ? selector(store.get()) : store.get()));

  return [state, store.set];
}

export { useFormStore };

export default FormStoreProvider;
