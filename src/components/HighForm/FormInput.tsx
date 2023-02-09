import React from "react";
import { Form, Input } from "antd";

interface IFormInputProps extends React.ComponentProps<typeof Form.Item> {
  placeholder?: string;
  disabled?: boolean;
}

export const FormInput = ({ disabled, placeholder, ...rest }: IFormInputProps) => {
  return (
    <Form.Item {...rest}>
      <Input {...{ disabled, placeholder }} />
    </Form.Item>
  );
};
