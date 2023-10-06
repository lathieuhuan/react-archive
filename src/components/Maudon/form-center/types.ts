import { FormValues, Path, PathValue } from "../types";

export type ValueWatcher<TFormValues extends FormValues> = <TFieldName extends Path<TFormValues> = Path<TFormValues>>(
  value: PathValue<TFormValues, TFieldName>
) => void;

type GetValue<TFormValues extends FormValues = FormValues> = {
  <TPath extends Path<TFormValues>>(path: TPath): TFormValues[TPath];
  (): TFormValues;
};

type SetValueOptions = {
  validate?: boolean;
};

type SetValue<TFormValues extends FormValues> = <TFieldName extends Path<TFormValues> = Path<TFormValues>>(
  name: TFieldName,
  value: PathValue<TFormValues, TFieldName>,
  options?: SetValueOptions
) => void;

export type InternalFormCenter<TFormValues extends FormValues = FormValues> = {
  getValue: GetValue<TFormValues>;
  setValue: SetValue<TFormValues>;
};

export type FormCenter<TFormValues extends FormValues = FormValues> = Pick<
  InternalFormCenter<TFormValues>,
  "getValue" | "setValue"
>;
