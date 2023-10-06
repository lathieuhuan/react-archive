import { FieldValues, useController } from "react-hook-form";

import Select, { SelectProps } from "@Components/Select";
import { ErrorMsg } from "../components";
import { Label } from "./Label";
import { FormItemProps } from "./types";

type FormSelectProps<T extends FieldValues> = Omit<SelectProps, "name"> & FormItemProps<T>;

export function FormSelect<T extends FieldValues>({ label, name, control, rules, ...rest }: FormSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <div className="flex flex-col">
      <Label rules={rules}>{label}</Label>
      <Select {...rest} {...field} value={field.value as string} />
      <ErrorMsg error={error} />
    </div>
  );
}
