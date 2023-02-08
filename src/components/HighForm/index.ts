import { HighForm as InternalForm } from "./HighForm";
import { FormCheckbox } from "./FormCheckbox";
import { FormInput } from "./FormInput";
import { FormGroup } from "./FormGroup";

type CompoundedComponent = typeof InternalForm & {
  Checkbox: typeof FormCheckbox;
  Input: typeof FormInput;
  Group: typeof FormGroup;
};

const HighForm = InternalForm as CompoundedComponent;

HighForm.Checkbox = FormCheckbox;
HighForm.Input = FormInput;
HighForm.Group = FormGroup;

export { HighForm };
