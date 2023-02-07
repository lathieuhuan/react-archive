import { Form, Input } from "antd";
import { ReactNode } from "react";

interface IFormInputProps {
  name: string;
  label?: ReactNode;
  disabled?: boolean;
}

export const FormInput = ({ disabled, ...rest }: IFormInputProps) => {
  return (
    <Form.Item {...rest}>
      <Input disabled={disabled} />
    </Form.Item>
  );
};
