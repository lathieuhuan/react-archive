import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";

import { FormData } from "./types";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { FormRadio } from "./FormRadio";
import { FormWatcher } from "./FormWatcher";

const defaultValues: Partial<FormData> = {
  formInput: "",
  formRadio: "RADIO_B",
  formSelect: "OPTION_C",
  dummy1: "",
};

export function LargeForm() {
  const methods = useForm<FormData>({
    mode: "onChange",
    defaultValues,
  });
  const { control, formState, reset, handleSubmit } = methods;
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
            name="formInput"
            label="Form Input"
            rules={{
              required: "This field is required",
              maxLength: {
                value: 12,
                message: "Max 12 characters",
              },
            }}
          />

          <FormInput
            control={control}
            name="formInputNumber"
            label="Form Input Number"
            type="number"
            rules={{
              required: "This field is required",
              max: {
                value: 100,
                message: "Max 100",
              },
            }}
          />
          <FormWatcher<FormData, "formInputNumber"> paths="formInputNumber">
            {(numberValue) => {
              return (
                <div>
                  <FormInput
                    control={control}
                    name="dummy1"
                    label="Dummy 1"
                    rules={{
                      required: {
                        value: numberValue > 20,
                        message: "This field is required",
                      },
                    }}
                  />
                  <p>This field is required when Form Input Number value is greater than 20</p>
                </div>
              );
            }}
          </FormWatcher>

          <FormRadio control={control} name="formRadio" label="Form Radio" className="mt-1 space-y-2">
            <FormRadio.Item value="RADIO_A">Radio A</FormRadio.Item>
            <FormRadio.Item value="RADIO_B">Radio B</FormRadio.Item>
            <FormRadio.Item value="RADIO_C">Radio C</FormRadio.Item>
          </FormRadio>

          <FormWatcher<FormData, "formRadio"> paths="formRadio">
            {(radioValue) => {
              return (
                <div>
                  <FormInput
                    control={control}
                    name="dummy2"
                    label="Dummy 2"
                    disabled={radioValue === "RADIO_A"}
                  />
                  <p>This field is disabled when Form Radio value is Radio A</p>
                </div>
              );
            }}
          </FormWatcher>

          <FormSelect
            control={control}
            name="formSelect"
            label="Form Select"
            options={[
              { label: "Option A", value: "OPTION_A" },
              { label: "Option B", value: "OPTION_B" },
              { label: "Option C", value: "OPTION_C" },
            ]}
          />

          <FormWatcher<FormData, "formSelect"> paths="formSelect">
            {(selectValue) => {
              return (
                <div>
                  {selectValue === "OPTION_A" ? null : <FormInput control={control} name="dummy3" label="Dummy 3" />}
                  <p>This field is unmounted when Form Select value is Option A</p>
                </div>
              );
            }}
          </FormWatcher>

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
