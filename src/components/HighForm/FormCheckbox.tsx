import type { ReactNode } from "react";
import type { Rule } from "antd/es/form";
import { Checkbox, Form } from "antd";

interface IFormCheckboxProps {
  name: string;
  label?: ReactNode;
  rules?: Rule[];
}

export const FormCheckbox = (props: IFormCheckboxProps) => {
  return (
    <Form.Item valuePropName="checked" {...props}>
      <Checkbox />
    </Form.Item>
  );
};
