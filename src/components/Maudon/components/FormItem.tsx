import { cloneElement } from "react";
import { useFormCenter } from "./FormCenterProvider";
import { FormCenterService } from "../form-center";

interface IFormItemProps {
  name: string;
  children: React.ReactElement;
}

export function FormItem({ name, children }: IFormItemProps) {
  const formCenter = useFormCenter() as FormCenterService;

  const handleChange = (e: any) => {
    formCenter._changeValue(name)(e);
  };

  return cloneElement(children, { ...children.props, onChange: handleChange });
}
