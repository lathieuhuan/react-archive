import { useSyncExternalStore } from "react";
import { FormCenterService, TFormCenter } from "../form-center";

export function useWatch(path: string, formCenter: TFormCenter) {
  return useSyncExternalStore(
    (subscriber) => (formCenter as FormCenterService)._watchValue(path, subscriber),
    () => formCenter.getValue(path)
  );
}
