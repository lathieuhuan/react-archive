import { useFormCenter } from "./FormCenterProvider";
import { FormCenter, FormCenterService } from "../form-center";
import { useWatch } from "../hooks";
import { FormValues, Path, PathValue } from "../types";

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
    formCenter._changeValue(e[0], name);
  };

  return children({
    control: {
      value,
      onChange: handleChange,
    },
  });
}
