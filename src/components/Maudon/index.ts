import { Form as InternalForm } from "./components/Form";
import { FormItem } from "./components/FormItem";
import { useFormCenter } from "./components/FormCenterProvider";
import { useForm } from "./hooks/useForm";
import { useWatch } from "./hooks/useWatch";

export type { FormValues, Path } from "./types";
export type { FormCenter } from './form-center'

type TFormCompound = typeof InternalForm & {
  Item: typeof FormItem;
  useForm: typeof useForm;
  useFormCenter: typeof useFormCenter;
  useWatch: typeof useWatch;
};

const Form = InternalForm as TFormCompound;

Form.Item = FormItem;
Form.useForm = useForm;
Form.useFormCenter = useFormCenter;
Form.useWatch = useWatch;

export { Form };
