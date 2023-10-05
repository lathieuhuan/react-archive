import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";

import { FormData } from "./types";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { FormRadio } from "./FormRadio";
import { FormWatcher } from "./FormWatcher";

const defaultValues: Partial<FormData> = {
  firstName: "",
  gender: "OTHER",
  occupation: "GAME_DEV",
};

export function LargeForm() {
  const methods = useForm<FormData>({
    mode: "onChange",
    defaultValues,
  });
  const { control, formState, trigger, watch, reset, getValues, handleSubmit, getFieldState } = methods;
  const [submittedData, setSubmittedData] = useState<any>();

  console.log("render");

  const onSubmit: SubmitHandler<FormData> = (values) => {
    setSubmittedData(values);
  };

  const onReset = () => {
    reset();
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            control={control}
            name="firstName"
            label="Name"
            rules={{
              required: "This field is required",
              maxLength: {
                value: 12,
                message: "Max 12 characters",
              },
            }}
          />

          <FormSelect
            control={control}
            name="occupation"
            label="Occupation"
            options={[
              { label: "Web Developer", value: "WEB_DEV" },
              { label: "Game Developer", value: "GAME_DEV" },
              { label: "AI Developer", value: "AI_DEV" },
            ]}
          />

          <FormWatcher<FormData, ["gender"]> paths={["gender"]}>
            {(values) => {
              const gender = values[0];

              return (
                <FormInput
                  control={control}
                  name="yoe"
                  label="Years of Experience"
                  rules={{
                    required: {
                      value: gender === "MALE",
                      message: "This field is required",
                    },
                  }}
                  type="number"
                />
              );
            }}
          </FormWatcher>

          <FormRadio control={control} name="gender" label="Gender" className="mt-1 space-y-2">
            <FormRadio.Item value="MALE">Male</FormRadio.Item>
            <FormRadio.Item value="FEMALE">Female</FormRadio.Item>
            <FormRadio.Item value="OTHER">Other</FormRadio.Item>
          </FormRadio>

          <div className="flex space-x-4">
            <button type="button" className="button button-danger" onClick={onReset}>
              Reset
            </button>
            <button type="submit" className="button button-primary" disabled={!formState.isValid}>
              Submit
            </button>
          </div>
        </form>
      </FormProvider>

      <div className="mt-4">
        <p>Submitted data</p>
        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
      </div>
    </div>
  );
}
