import { Control, ControllerProps, FieldValues, Path, useController } from "react-hook-form";
import Select, { SelectProps } from "@Components/Select";
import { ErrorMsg } from "../components";

type FormSelectProps<T extends FieldValues> = SelectProps & {
  label?: string;
  name: Path<T>;
  control: Control<T, any>;
  rules?: ControllerProps["rules"];
};
export function FormSelect<T extends FieldValues>({ label, name, control, rules, ...rest }: FormSelectProps<T>) {
  const {
    field,
    formState: { errors },
  } = useController({ name, control, rules });

  return (
    <div className="flex flex-col">
      <label>
        {rules?.required ? <span className="text-red-500">*</span> : null} {label}
      </label>
      <Select {...rest} {...field} value={field.value as string} />
      <ErrorMsg error={errors[name]} />
    </div>
  );
}
