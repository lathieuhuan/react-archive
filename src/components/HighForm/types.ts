import type { CSSProperties, ReactNode } from "react";
import type { ColProps, FormInstance } from "antd";
import { Store } from "antd/es/form/interface";

export interface IHighFormProps<T extends Store> {
  form: FormInstance;
  name: string;
  children: ReactNode;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  initialValues?: T;
  style?: CSSProperties;
  onValuesChange?: (changedValues: any, formValues: T) => void;
  onFinish?: (values: T) => void;
}

type PrimalType = string | boolean | number | undefined;

export type DisableSubRule = Record<string, PrimalType | PrimalType[]>;

export type DisableRule = {
  allOf?: DisableSubRule;
  anyOf?: DisableSubRule;
};
