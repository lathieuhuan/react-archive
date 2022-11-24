import { SubmitHandler, useForm } from "react-hook-form";
import InputBox from "@Components/InputBox";
import { showNotify } from "@Src/utils";
import { ErrorMsg } from "../components";
import { COLORS, GENDERS, OCCUPATIONS } from "../constant";
import { PlainFormField } from "../types";

export default function PlainValues() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlainFormField>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      age: null,
      gender: "male",
      colors: [],
      occupation: null,
    },
  });

  const onSubmit: SubmitHandler<PlainFormField> = (data) => {
    showNotify({
      message: "Submitted Info",
      description: data,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <InputBox
          className="w-full"
          placeholder="Enter name"
          {...register("name", {
            required: "Name is required",
          })}
        />
        <ErrorMsg error={errors.name} />
      </div>

      <div>
        <InputBox
          className="w-full"
          type="number"
          placeholder="Enter age"
          {...register("age", {
            required: "Age is required",
            min: {
              value: 12,
              message: "Minimum age is 12",
            },
            max: {
              value: 70,
              message: "Maximum age is 70",
            },
          })}
        />
        <ErrorMsg error={errors.age} />
      </div>

      <div className="flex items-center">
        <label className="mr-2 text-lg" htmlFor="gender">
          Choose gender
        </label>
        <select
          className="px-4 py-2 rounded capitalize"
          {...register("gender", {
            required: "Gender is required",
          })}
        >
          {GENDERS.map((gender) => {
            return (
              <option className="capitalize" key={gender}>
                {gender}
              </option>
            );
          })}
        </select>
        {errors.gender && (
          <p className="mt-2 text-red-500">{errors.gender.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-lg">Choose colors</p>
        <ul className="pl-2">
          {COLORS.map((color) => {
            return (
              <li key={color} className="mt-2">
                <label>
                  <input
                    className="mr-2"
                    type="checkbox"
                    {...register("colors", {
                      required: "Choose atleast 1 color",
                    })}
                    value={color}
                  />
                  <span className="capitalize" style={{ color }}>
                    {color}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {/*
          defaultValues.colors is an array but its error message is still string
          see https://github.com/react-hook-form/react-hook-form/issues/7972
        */}
        <ErrorMsg error={errors.colors} />
      </div>

      <div>
        <p className="text-lg">Choose occupation</p>
        <div className="mt-2 pl-2 flex gap-4">
          {OCCUPATIONS.map((occ) => {
            return (
              <label key={occ}>
                <input
                  className="mr-2"
                  type="radio"
                  {...register("occupation", {
                    required: "Choose an occupation",
                  })}
                  value={occ}
                />
                <span className="capitalize">{occ}</span>
              </label>
            );
          })}
        </div>
        <ErrorMsg error={errors.occupation} />
      </div>

      <button className="mx-auto button button-primary" type="submit">
        Submit
      </button>
    </form>
  );
}
