import classNames from "classnames";
import { ChangeEvent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { FieldValues, useController } from "react-hook-form";

import { ErrorMsg } from "../components";
import { Label } from "./Label";
import { FormItemProps } from "./types";

type RadioValue = string | number | boolean | undefined;

type RadioContext = {
  value: RadioValue;
  onChange: (value: RadioValue) => void;
};

const Context = createContext<RadioContext | null>(null);

type ItemProps = {
  value: RadioValue;
  disabled?: boolean;
  children: ReactNode;
};
function Item(props: ItemProps) {
  const context = useContext(Context);
  const checked = context?.value === props.value;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!checked) {
      context?.onChange(props.value);
    }
  };

  return (
    <label
      className={classNames(
        "w-fit flex items-center space-x-2",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <input type="radio" checked={checked} disabled={props.disabled} onChange={onChange} />
      <span>{props.children}</span>
    </label>
  );
}

type FormRadioProps<T extends FieldValues> = FormItemProps<T> & {
  className?: string;
  children: ReactNode;
  onChange?: (value: RadioValue) => void;
};
function FormRadio<T extends FieldValues>({
  className,
  children,
  label,
  onChange,
  ...controlProps
}: FormRadioProps<T>) {
  const [value, setValue] = useState<RadioValue>();

  const {
    field,
    fieldState: { error },
  } = useController(controlProps);

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  const handleChange = (newValue: RadioValue) => {
    onChange?.(newValue);
    field.onChange(newValue);
    setValue(newValue);
  };

  return (
    <Context.Provider value={{ value, onChange: handleChange }}>
      <div className="flex flex-col">
        <Label rules={controlProps.rules}>{label}</Label>
        <div className={className}>{children}</div>
        <ErrorMsg error={error} />
      </div>
    </Context.Provider>
  );
}

FormRadio.Item = Item;

export { FormRadio };
