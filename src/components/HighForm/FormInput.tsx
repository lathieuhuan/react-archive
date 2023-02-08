import React from "react";
import { Form, Input } from "antd";

interface IFormInputProps extends React.ComponentProps<typeof Form.Item> {
  disabled?: boolean;
}

export const FormInput = ({ disabled, ...rest }: IFormInputProps) => {
  return (
    <Form.Item {...rest}>
      <Input disabled={disabled} />
    </Form.Item>
  );
};
