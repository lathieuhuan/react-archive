import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../../components/Button";
import InputBox from "../../../components/InputBox";
import { showNotify } from "../../../utils";
import { ErrorMsg } from "../components";
import { NestedFormField } from "../types";

export default function NestedValues() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NestedFormField>({
    defaultValues: {
      fullname: {
        fistname: "",
        lastname: "",
      },
      colors: [],
      socials: [],
    },
  });

  const onSubmit: SubmitHandler<NestedFormField> = (data) => {
    showNotify({
      message: "Submitted Info",
      description: data
    })
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg flex flex-col gap-3"
      >
        <div>
          <div className="flex gap-2">
            <InputBox
              className="w-48"
              placeholder="Enter first name"
              {...register("fullname.fistname", {
                required: "Please enter first name",
              })}
            />
            <InputBox
              className="w-48"
              placeholder="Enter last name"
              {...register("fullname.lastname", {
                required: "Please enter last name",
              })}
            />
          </div>
          <ErrorMsg
            error={errors.fullname?.fistname || errors.fullname?.lastname}
          />
        </div>

        <div>
          
        </div>

        <Button className="mx-auto" type="submit">Submit</Button>
      </form>
    </div>
  );
}
