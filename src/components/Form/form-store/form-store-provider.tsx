import { createContext, useCallback, useRef } from 'react';

export type TFormStore = {
    activeGroupKeys: string[];
    accordionMode: boolean;
    disabledFields: string[];
    /** Flag to prevent groups from validating fields when they're initially closed */
    isValidatingGroup: boolean;
};

const DEFAULT_STORE: TFormStore = {
    activeGroupKeys: [],
    accordionMode: true,
    isValidatingGroup: false,
    disabledFields: [],
};

const getDefaultFormStoreData = (defaultValues?: Partial<TFormStore>): TFormStore => {
    const {
        activeGroupKeys = DEFAULT_STORE.activeGroupKeys,
        accordionMode = DEFAULT_STORE.accordionMode,
        isValidatingGroup = DEFAULT_STORE.isValidatingGroup,
        disabledFields = DEFAULT_STORE.disabledFields,
    } = defaultValues || {};

    return { activeGroupKeys, accordionMode, isValidatingGroup, disabledFields };
};

const useFormStoreData = (
    initialValues?: Partial<TFormStore>
): {
    get: () => TFormStore;
    set: (value: Partial<TFormStore>) => void;
    subscribe: (callback: () => void) => () => void;
} => {
    const formStore = useRef(getDefaultFormStoreData(initialValues));
    const subscribers = useRef(new Set<() => void>());

    const get = useCallback(() => formStore.current, []);

    const set = useCallback((value: Partial<TFormStore>) => {
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

type TFormStoreReturnType = ReturnType<typeof useFormStoreData>;

export const FormStoreContext = createContext<TFormStoreReturnType>({
    get: () => DEFAULT_STORE,
    set: () => undefined,
    subscribe: () => () => undefined,
});

interface IFormStoreProviderProps {
    children: React.ReactNode;
    initialValues?: Partial<TFormStore>;
}

export const FormStoreProvider = ({ children, initialValues }: IFormStoreProviderProps) => {
    const storeData = useFormStoreData(initialValues);

    return <FormStoreContext.Provider value={storeData}>{children}</FormStoreContext.Provider>;
};
