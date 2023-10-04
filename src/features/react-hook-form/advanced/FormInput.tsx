import { Control, ControllerProps, FieldValues, Path, useController } from "react-hook-form";
import InputBox, { InputBoxProps } from "@Components/InputBox";
import { ErrorMsg } from "../components";

type FormInputProps<T extends FieldValues> = InputBoxProps & {
  label?: string;
  name: Path<T>;
  control: Control<T, any>;
  rules?: ControllerProps["rules"];
  placeholder?: string;
};
export function FormInput<T extends FieldValues>({
  label,
  name,
  control,
  rules,
  placeholder = "Enter",
  ...rest
}: FormInputProps<T>) {
  const {
    field,
    formState: { errors },
  } = useController({ name, control, rules });

  return (
    <div className="flex flex-col">
      <label>
        {rules?.required ? <span className="text-red-500">*</span> : null} {label}
      </label>
      <InputBox placeholder={placeholder} {...rest} onChange={(e) => field.onChange(e.target.value)} />
      <ErrorMsg error={errors[name]} />
    </div>
  );
}
