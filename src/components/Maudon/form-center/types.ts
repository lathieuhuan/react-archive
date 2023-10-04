export type TFormValues = Record<string, any>;

export type TSubscriber<K extends keyof T = any, T extends TFormValues = any> = (value: T[K]) => void;

type TGetValue = (path: string) => any;

type FieldValue<TFieldValues extends TFormValues> = TFieldValues[string];

type SetFieldValue<TFieldValues extends TFormValues> = FieldValue<TFieldValues>;

type TSetValueOptions = {
  validate?: boolean;
};

type TSetValue = (name: string, value: SetFieldValue<TFormValues>, options?: TSetValueOptions) => void;

type TRegister = (path: string) => {
  onChange: (e: any) => void;
};

export type TInternalFormCenter = {
  register: TRegister;
  getValue: TGetValue;
  setValue: TSetValue;
};

export type TFormCenter = Pick<TInternalFormCenter, "register" | "getValue" | "setValue">;
