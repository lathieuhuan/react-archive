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

export type PrimalType = string | boolean | number | undefined;

export type DisableFieldRule = Record<string, PrimalType | PrimalType[]>;

export type DisableSubRule = {
  fields?: DisableFieldRule;
  allOf?: DisableSubRule | DisableSubRule[];
  someOf?: DisableSubRule | DisableSubRule[];
};

type AllOfCondition = {
  type: "allOf";
  fields: DisableFieldRule;
};

type AnyOfCondition = {
  type: "anyOf";
  fields: DisableFieldRule;
};

type SomeOfCondition = {
  type: "someOf";
  fields: DisableFieldRule;
  count: number;
};

export type Condition = AllOfCondition | AnyOfCondition;

export type DisableRule = {
  checkFields: string[];
  conditions: Condition | Condition[];
};
