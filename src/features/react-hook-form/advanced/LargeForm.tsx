import { SubmitHandler, useForm } from "react-hook-form";
import { FormData } from "./types";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";

export function LargeForm() {
  const { control, formState, handleSubmit } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      gender: "OTHER",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    console.log(JSON.stringify(values, null, 2));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormInput label="Name" name="firstName" control={control} rules={{ required: "This field is required" }} />

      <FormSelect
        label="Gender"
        name="gender"
        options={[
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Other", value: "OTHER" },
        ]}
        control={control}
      />

      <button type="submit" className="button button-primary" disabled={!formState.isValid}>
        Submit
      </button>
    </form>
  );
}
