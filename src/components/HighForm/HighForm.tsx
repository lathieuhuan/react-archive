import React, { useState } from "react";
import { Form as AntdForm } from "antd";
import FormStoreProvider from "./form-store";
import { checkAndDisableV1 } from "./trials/ver1";

import "./style.scss";
import classNames from "classnames";

interface IHighFormProps extends Omit<React.ComponentProps<typeof AntdForm>, "form"> {
  initialActiveGroupKeys?: string | string[];
  accordionMode?: boolean;
}

export const HighForm = ({ initialActiveGroupKeys = [], accordionMode, onValuesChange, ...rest }: IHighFormProps) => {
  const [form] = AntdForm.useForm();

  const onFormValuesChange = (changedValues: any, values: unknown) => {
    onValuesChange?.(changedValues, values);

    // checkAndDisableV1(disables, setDisables)(changedValues, values);
  };

  return (
    <FormStoreProvider
      initialValues={{
        activeGroupKeys: Array.isArray(initialActiveGroupKeys) ? initialActiveGroupKeys : [initialActiveGroupKeys],
        accordionMode,
      }}
    >
      <AntdForm
        form={form}
        {...rest}
        className={classNames("voucher-custom-form", rest.className)}
        onValuesChange={onFormValuesChange}
      />
      ;
    </FormStoreProvider>
  );
};
