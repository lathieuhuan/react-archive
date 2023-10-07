import { FormCenter, FormCenterService } from "../form-center";
import { useWatch } from "../hooks";
import { useFormCenter } from "./FormCenterProvider";
import { FormValues, Path, PathValue } from "../types";
import isNullOrUndefined from "../utils/isNullOrUndefined";

type RenderChildrenProps<TFormValues extends FormValues, TPath extends Path<TFormValues>> = {
  control: {
    value: PathValue<TFormValues, TPath>;
    onChange: (...e: any[]) => void;
  };
};

interface IFormItemProps<TFormValues extends FormValues, TPath extends Path<TFormValues>> {
  form?: FormCenter<TFormValues>;
  name: TPath;
  children: (props: RenderChildrenProps<TFormValues, TPath>) => React.ReactElement | null;
}

export function FormItem<
  TFormValues extends FormValues = FormValues,
  TPath extends Path<TFormValues> = Path<TFormValues>
>({ form, name, children }: IFormItemProps<TFormValues, TPath>) {
  const formCenter = useFormCenter(form) as FormCenterService<TFormValues>;
  const value = useWatch(formCenter, name);

  const handleChange = (...e: any[]) => {
    const value = e[0];
    let newValue;

    if (isNullOrUndefined(value)) {
      newValue = value;
    } else if ("target" in value) {
      newValue = (value as any)?.target?.value;
    } else {
      newValue = value;
    }

    formCenter.setValue(name, newValue);
  };

  return children({
    control: {
      value,
      onChange: handleChange,
    },
  });
}
