import { ReactElement } from "react";

export function genForm<T extends Record<string, unknown>>() {
  interface IFormItemProps<K extends keyof T> {
    name: K;
    children: (control: { value: T[K]; onChange: (value: T[K]) => void }) => ReactElement<any, any> | null;
  }

  const formData = {} as T;

  console.log("genForm");

  function FormItem<K extends keyof T>({ name, children }: IFormItemProps<K>) {
    console.log("FormItem");

    return children({
      value: formData[name],
      onChange: (value) => {
        formData[name] = value;
      },
    });
  }

  return {
    FormItem,
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
