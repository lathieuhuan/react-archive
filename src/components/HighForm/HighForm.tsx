import React from "react";
import { Form as AntdForm } from "antd";
import FormStoreProvider from "./form-store";
import { checkAndDisableV1 } from "./trials/ver1";

interface IHighFormProps extends Omit<React.ComponentProps<typeof AntdForm>, "form"> {
  initialActiveGroupKeys?: string | string[];
  accordionGroups?: boolean;
}

export const HighForm = ({ initialActiveGroupKeys = [], accordionGroups, onValuesChange, ...rest }: IHighFormProps) => {
  const [form] = AntdForm.useForm();

  const onFormValuesChange = (changedValues: any, values: unknown) => {
    onValuesChange?.(changedValues, values);

    // checkAndDisableV1(disables, setDisables)(changedValues, values);
  };

  return (
    <FormStoreProvider
      defaultValues={{
        activeGroupKeys: Array.isArray(initialActiveGroupKeys) ? initialActiveGroupKeys : [initialActiveGroupKeys],
        accordionGroups,
      }}
    >
      <AntdForm form={form} {...rest} onValuesChange={onFormValuesChange} />;
    </FormStoreProvider>
  );
};
