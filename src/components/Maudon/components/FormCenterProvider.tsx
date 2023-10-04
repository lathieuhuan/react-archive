import { createContext, useContext } from "react";
import { TFormCenter } from "../form-center";

export const FormCenterContext = createContext<TFormCenter | null>(null);

type FormCenterProviderProps = {
  formCenter: TFormCenter;
  children: React.ReactNode;
};
export function FormCenterProvider(props: FormCenterProviderProps) {
  return <FormCenterContext.Provider value={props.formCenter}>{props.children}</FormCenterContext.Provider>;
}

export const useFormCenter = () => {
  const formCenter = useContext(FormCenterContext);

  if (!formCenter) {
    throw new Error("useFormCenter must be used inside FormCenterProvider");
  }
  return formCenter;
};
