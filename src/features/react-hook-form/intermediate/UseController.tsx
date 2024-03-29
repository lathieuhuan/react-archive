import { useForm, Controller, SubmitHandler } from "react-hook-form";
import JsonDisplayer from "@Components/JsonDisplayer";
import { showNotify } from "@Src/utils";

import { COLORS } from "../constant";
import { UseControllerFormData } from "./types";
import customResolver from "./custom-resolver";
import InputBox from "@Components/InputBox";

export const UseController = () => {
  const { handleSubmit, watch, control, reset } = useForm<UseControllerFormData>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      colors: [],
    },
    resolver: customResolver,
  });

  const onSubmit: SubmitHandler<UseControllerFormData> = (data) => {
    showNotify({
      message: "Submitted Data",
      description: JSON.stringify(data, null, 2),
      style: {
        height: "200px",
        whiteSpace: "pre",
        overflow: "auto",
      },
    });
  };

  return (
    <div>
      <form className="w-80 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <InputBox placeholder="Enter your name" value={value} onChange={onChange} onBlur={onBlur} ref={ref} />
              );
            }}
          />
        </div>

        <Controller
          control={control}
          name="colors"
          render={({ field: { onChange, value } }) => {
            return (
              <div className="mt-4 flex space-x-4">
                {COLORS.map((color, i) => {
                  const checked = value.includes(color);
                  return (
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (checked) {
                            onChange(value.filter((existedColor) => existedColor !== color));
                          } else {
                            onChange([...value, color]);
                          }
                        }}
                      />
                      <span className="ml-2 capitalize">{color}</span>
                    </label>
                  );
                })}
              </div>
            );
          }}
        />

        <div className="mx-auto mt-4 flex gap-3">
          <button type="button" className="button border" onClick={() => reset()}>
            Reset
          </button>
          <button className="button button-primary" type="submit">
            Submit
          </button>
        </div>
      </form>

      <JsonDisplayer className="mt-4" title="Form Data" body={watch()} />
    </div>
  );
};
