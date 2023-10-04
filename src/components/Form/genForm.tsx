import { FormEvent, ReactElement, useRef, useState } from "react";

interface IGenFormArgs<T> {
  // onSubmit: (data: T) => void
}

export function genForm<T = Record<PropertyKey, unknown>>(options?: IGenFormArgs<T>) {
  interface IFormItemProps<K extends keyof T> {
    name: K;
    validate?: (value: any) => boolean | string;
    children: (control: {
      // value: T[K];
      error?: string;
      onChange: (value: T[K]) => void;
    }) => ReactElement<any, any> | null;
  }

  const formData = useRef({} as T);
  const formErrors = useRef({} as Record<keyof T, string | undefined>);

  function FormItem<K extends keyof T>({ name, validate, children }: IFormItemProps<K>) {
    const [boo, setBoo] = useState(false);

    return children({
      // value: formData[name],
      error: formErrors.current[name],
      onChange: (value) => {
        const error = !validate || validate(value);

        if (typeof error === "string") {
          formErrors.current[name] = error;
          setBoo(!boo);
        } else if (!error) {
          formErrors.current[name] = "Error";
          setBoo(!boo);
        } else if (formErrors.current[name]) {
          formErrors.current[name] = undefined;
          setBoo(!boo);
        }

        formData.current[name] = value;
      },
    });
  }

  return {
    FormItem,
    getFormProps: (config: { onSubmit: (data: T) => void }) => {
      const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        config.onSubmit?.(formData.current);
      };
      return {
        onSubmit,
      };
    },
  };
}
