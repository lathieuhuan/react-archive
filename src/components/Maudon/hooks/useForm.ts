import { useRef } from "react";
import { FormCenterService, TFormCenter } from "../form-center";

interface IUseFormArgs {
  //
}

export function useForm(args?: IUseFormArgs) {
  const formCenter = useRef<TFormCenter>();

  if (!formCenter.current) {
    formCenter.current = new FormCenterService();
  }

  return formCenter.current;
}
