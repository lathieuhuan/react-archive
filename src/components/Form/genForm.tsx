import { FormEventHandler, ReactElement, useRef } from "react";

interface IGenFormArgs<T> {
  onSubmit?: (data: T) => void;
}

export function genForm<T extends Record<PropertyKey, unknown>>(options?: IGenFormArgs<T>) {
  interface IFormItemProps<K extends keyof T> {
    name: K;
    children: (control: {
      // value: T[K];
      onChange: (value: T[K]) => void;
    }) => ReactElement<any, any> | null;
  }

  const formData = useRef({} as T);

  console.log("genForm");

  function FormItem<K extends keyof T>({ name, children }: IFormItemProps<K>) {
    console.log("FormItem");

    return children({
      // value: formData[name],
      onChange: (value) => {
        formData.current[name] = value;
      },
    });
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    options?.onSubmit?.(formData.current);
  };

  return {
    FormItem,
    getFormProps: () => ({
      onSubmit,
    }),
  };
}

// function getObj<T extends Record<string, unknown>>() {
//   const obj = {} as T;

//   function item<K extends keyof T>(name: K, render: (value: T[K]) => number) {
//     return render(obj[name]);
//   }

//   return {
//     item,
//   };
// }

// type Obj = {
//   key: number;
// };

// const obj = getObj<Obj>();
// const b = obj.item("key", (value) => 2);
