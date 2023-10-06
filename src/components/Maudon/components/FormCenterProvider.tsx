import { createContext, useContext } from "react";
import { FormCenter } from "../form-center";
import { FormValues } from "../types";

export const FormCenterContext = createContext<FormCenter | null>(null);

type FormCenterProviderProps<TFormValues extends FormValues> = {
  formCenter: FormCenter<TFormValues>;
  children: React.ReactNode;
};
export function FormCenterProvider<TFormValues extends FormValues = FormValues>(
  props: FormCenterProviderProps<TFormValues>
) {
  return (
    <FormCenterContext.Provider value={props.formCenter as FormCenter}>{props.children}</FormCenterContext.Provider>
  );
}

export function useFormCenter<TFormValues extends FormValues = FormValues>(form?: FormCenter<TFormValues>) {
  const formCenter = useContext(FormCenterContext);

  if (!formCenter) {
    throw new Error("useFormCenter must be used inside FormCenterProvider");
  }
  return (form || formCenter) as FormCenter<TFormValues>;
}
