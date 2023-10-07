import { FormValues, Path } from "./index";

type ValidateRule<TFormValues extends FormValues, ValueType> =
  | ValueType
  | {
      value: ValueType | ((values: TFormValues) => ValueType);
      message: string;
    };

type ValidateRules<TFormValues extends FormValues> = {
  required?: ValidateRule<TFormValues, boolean>;
  validate?: (value: TFormValues) => boolean;
};

export type FormRules<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, ValidateRules<TFormValues>>>;
