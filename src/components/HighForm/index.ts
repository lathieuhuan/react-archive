import { HighForm as InternalForm } from "./HighForm";
import { FormCheckbox } from "./FormCheckbox";
import { FormInput } from "./FormInput";

type CompoundedComponent = typeof InternalForm & {
  Checkbox: typeof FormCheckbox;
  Input: typeof FormInput;
};

const HighForm = InternalForm as CompoundedComponent;

HighForm.Checkbox = FormCheckbox;
HighForm.Input = FormInput;

export { HighForm };
