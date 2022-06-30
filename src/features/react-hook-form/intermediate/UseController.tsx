import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, Input } from "antd";
import JsonDisplayer from "../../../components/JsonDisplayer";
import { COLORS } from "../constant";
import { showNotify } from "../../../utils";
import { UseControllerFormData } from "./types";
import customResolver from "./custom-resolver";

export default function UseController() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<UseControllerFormData>({
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
  // console.log("run");

  return (
    <div>
      <form className="w-80 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Input
                  placeholder="Enter your name"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                />
              );
            }}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="colors"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              console.log(value);
              return (
                <div>
                  {COLORS.map((c, i) => (
                    <div key={i}>
                      <input type="checkbox" hidden />
                      <label htmlFor="">{c}</label>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </div>

        <div className="mx-auto mt-4 flex gap-3">
          {/* background-color: transparent of tailwind overwrite background-color of antd Button */}
          <Button
            htmlType="button"
            type="primary"
            danger
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button className="bg-blue-400" htmlType="submit" type="primary">
            Submit
          </Button>
        </div>
      </form>

      <JsonDisplayer className="mt-4" title="Form Data" body={watch()} />
    </div>
  );
}
