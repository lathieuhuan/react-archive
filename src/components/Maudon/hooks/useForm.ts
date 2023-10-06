import { useRef } from "react";
import { FormCenterService, FormCenter } from "../form-center";
import { FormValues } from "../types";

interface IUseFormArgs<TFormValues extends FormValues> {
  form?: FormCenter<TFormValues>;
  defaultValues?: any;
}

export function useForm<TFormValues extends FormValues = FormValues>(args?: IUseFormArgs<TFormValues>) {
  const formCenter = useRef<FormCenter<TFormValues> | undefined>(args?.form);

  if (!formCenter.current) {
    formCenter.current = new FormCenterService<TFormValues>();
  }

  return formCenter.current;
}
