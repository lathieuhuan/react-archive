import { useForm } from "../hooks";
import { FormCenterProvider } from "./FormCenterProvider";

interface IFormProps {
  children: React.ReactNode;
}

export function Form(props: IFormProps) {
  const formCenter = useForm();

  return (
    <FormCenterProvider formCenter={formCenter}>
      <form {...props} />
    </FormCenterProvider>
  );
}
