import { ChangeEvent } from "react";
import { FieldValues, useController } from "react-hook-form";

import InputBox, { InputBoxProps } from "@Components/InputBox";
import { ErrorMsg } from "../components";
import { Label } from "./Label";
import { FormItemProps } from "./types";

type FormInputProps<T extends FieldValues> = Omit<InputBoxProps, "name"> & FormItemProps<T>;

export function FormInput<T extends FieldValues>({
  label,
  name,
  control,
  rules,
  type,
  placeholder = "Enter",
  ...rest
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const value = type === "number" && field.value === undefined ? "" : field.value;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    field.onChange(type === "number" ? (value === "" ? undefined : +value) : value);
  };

  return (
    <div className="flex flex-col">
      <Label rules={rules}>{label}</Label>
      <InputBox placeholder={placeholder} {...rest} {...field} type={type} value={value} onChange={onChange} />
      <ErrorMsg error={error} />
    </div>
  );
}
