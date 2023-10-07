import { ChangeEvent } from "react";
import { FieldValues, useController } from "react-hook-form";

import Select, { SelectProps } from "@Components/Select";
import { ErrorMsg } from "../components";
import { Label } from "./Label";
import { FormItemProps } from "./types";

type FormSelectProps<T extends FieldValues> = Omit<SelectProps, "name"> & FormItemProps<T>;

export function FormSelect<T extends FieldValues>({ label, name, rules, ...rest }: FormSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, rules });

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    field.onChange(e);
    rest.onChange?.(e);
  };

  return (
    <div className="flex flex-col">
      <Label rules={rules}>{label}</Label>
      <Select {...rest} {...field} value={field.value as string} onChange={onChange} />
      <ErrorMsg error={error} />
    </div>
  );
}
