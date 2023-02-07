import { useState } from "react";
import { Form } from "antd";
import type { Store } from "antd/es/form/interface";
import type { IHighFormProps } from "./types";

export const HighForm = <T extends Store>({ ...rest }: IHighFormProps<T>) => {
  //   const [disables, setDisables] = useState<Partial<Record<keyof T, boolean[]>>>({});

  return <Form {...rest} />;
};
