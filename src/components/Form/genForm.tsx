interface IFormItemControl {
  value: string;
  onChange: (value: string) => void;
}

interface IFormItemProps<K> {
  name: K;
  children: (control: IFormItemControl) => React.ReactElement<any, any> | null;
}

export function genForm<T extends Record<string, unknown>>() {
  const formData = {} as T;

  console.log("genForm");

  function FormItem<K extends keyof T>({
    name,
    children,
  }: {
    name: K;
    children: (control: {
      value: T[K];
      onChange: (value: T[K]) => void;
    }) => React.ReactElement<any, any> | null;
  }): React.ReactElement<any, any> | null {
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

function getObj<T extends Record<string, unknown>>() {
  const obj = {} as T;

  function item<K extends keyof T>(name: K, render: (value: T[K]) => number) {
    return render(obj[name]);
  }

  return {
    item,
  };
}

type Obj = {
  key: number;
};

// const obj = getObj<Obj>();

// const b = obj.item("key", (value) => 2);
