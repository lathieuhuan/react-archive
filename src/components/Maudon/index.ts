import { Form as InternalForm } from "./components/Form";
import { FormItem } from "./components/FormItem";
import { useForm } from "./hooks/useForm";

type TFormCompound = typeof InternalForm & {
  Item: typeof FormItem;
  useForm: typeof useForm;
};

const Form = InternalForm as TFormCompound;

Form.Item = FormItem;
Form.useForm = useForm;

export { Form };
