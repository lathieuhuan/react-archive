import { useSyncExternalStore } from "react";
import { FormCenterService, FormCenter } from "../form-center";
import { FormValues, Path } from "../types";

// Improve: should return defaultValue on first render when pass formCenter

export function useWatch<
  TFormValues extends FormValues = FormValues,
  TPath extends Path<TFormValues> = Path<TFormValues>
>(formCenter: FormCenter<TFormValues>, path: TPath) {
  return useSyncExternalStore(
    (subscriber) => (formCenter as FormCenterService<TFormValues>)._watchValue(path, subscriber),
    () => formCenter.getValue<TPath>(path)
  );
}
