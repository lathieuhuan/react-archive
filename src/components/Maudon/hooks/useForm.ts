import { useEffect, useRef } from "react";
import { FormCenterService, FormCenter } from "../form-center";
import { FormValues } from "../types";
import { DeepPartial } from "../types/utils";
import { FormRules } from "../types/validate";

interface UseFormArgs<TFormValues extends FormValues> {
  form?: FormCenter<TFormValues>;
  defaultValues?: DeepPartial<TFormValues>;
  rules?: FormRules<TFormValues>;
}

export function useForm<TFormValues extends FormValues = FormValues>(args?: UseFormArgs<TFormValues>) {
  const formCenter = useRef<FormCenter<TFormValues> | undefined>(args?.form);

  if (!formCenter.current) {
    formCenter.current = new FormCenterService<TFormValues>({ defaultValues: args?.defaultValues });
  }

  useEffect(() => {
    if (args?.rules) {
      const form = formCenter.current as FormCenterService<TFormValues>;
      form.updateFormRules(args?.rules);
    }
  }, []);

  return formCenter.current;
}
