import {
  SubmitHandler,
  useFieldArray,
  useForm,
  // useFormState,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

import InputBox from "@Components/InputBox";
import { showNotify } from "@Src/utils";
import { ErrorMsg } from "../../components";

import { NestedFormField } from "../../types";
import { COLORS } from "../../constant";
import FieldArrayPitfall from "./FieldArrayPitfall";

const MIN_NUM_OF_SOCIALS = 2;

const schema: yup.SchemaOf<NestedFormField> = yup.object().shape({
  fullname: yup.object({
    firstname: yup.string().required().min(2),
    lastname: yup.string().required().min(3).max(5),
  }),
  colors: yup.array().min(1),
  socials: yup
    .array(
      yup.object({
        type: yup.string().required(),
        url: yup.string().required(),
      })
    )
    .min(MIN_NUM_OF_SOCIALS),
});

export const NestedValues = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    clearErrors,
    // trigger,
    formState: { errors, isSubmitted },
  } = useForm<NestedFormField>({
    mode: "onTouched",
    reValidateMode: "onChange", // default is "onChange"
    // shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      fullname: {
        firstname: "ab",
        lastname: "abc",
      },
      colors: ["blue"],
      socials: [{ type: "", url: "" }],
    },
    resolver: yupResolver(schema),
  });
  // const formState = useFormState({ control });
  // const socialsTouched = formState.touchedFields.socials;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "socials",
  });

  let socialsNotAddable = false;
  const socials = watch("socials");
  for (const social of socials) {
    if (!social.type || !social.url) {
      socialsNotAddable = true;
      break;
    }
  }

  const onSubmit: SubmitHandler<NestedFormField> = (data) => {
    showNotify({
      message: "Submitted Info",
      description: JSON.stringify(data, null, 2),
      style: {
        height: "600px",
        whiteSpace: "pre",
        overflow: "auto",
      },
    });
  };

  return (
    <div className="flex gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <p className="mb-2 italic text-right text-slate-400">Validate with Yup</p>
        <div>
          <div className="grid grid-cols-2 gap-2">
            <InputBox placeholder="Enter first name" {...register("fullname.firstname")} />
            <InputBox placeholder="Enter last name" {...register("fullname.lastname")} />
          </div>
          <ErrorMsg error={errors.fullname?.firstname || errors.fullname?.lastname} />
        </div>

        <div className="flex flex-col">
          <p className="text-lg">Choose colors</p>
          <ul className="pl-2 flex gap-4">
            {COLORS.map((color) => {
              return (
                <li key={color} className="mt-2">
                  <label>
                    <input className="mr-2" type="checkbox" {...register("colors")} value={color} />
                    <span className="capitalize" style={{ color }}>
                      {color}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {/* see https://github.com/react-hook-form/react-hook-form/issues/7972 */}
          <ErrorMsg error={errors.colors} />
        </div>

        <div>
          <p>Add socials (atleast {MIN_NUM_OF_SOCIALS})</p>
          <div className="mt-2 flex flex-col gap-2">
            {fields.map((social, i) => {
              return (
                <div key={social.id}>
                  <div className="flex gap-2">
                    <InputBox placeholder="Enter social type" {...register(`socials.${i}.type`)} />
                    <InputBox placeholder="Enter social url" {...register(`socials.${i}.url`)} />
                    <button
                      className="w-10 min-w-[40px] bg-red-200 hover:bg-red-300 text-black rounded"
                      onClick={() => {
                        remove(i);
                        clearErrors(`socials.${i}`);
                      }}
                      disabled={socials.length === 1}
                    >
                      <MinusOutlined />
                    </button>
                  </div>
                  <ErrorMsg error={errors.socials?.[i]?.type || errors.socials?.[i]?.url} />
                </div>
              );
            })}
          </div>
          <button
            className="mt-4 w-full h-10 button bg-green-200 hover:bg-green-300 text-black"
            type="button"
            onClick={() => {
              append({ type: "", url: "" }, { shouldFocus: false });
              // trigger("socials"); // async
            }}
            disabled={socialsNotAddable}
          >
            <PlusOutlined />
          </button>

          {/* <ErrorMsg error={errors.socials} /> */}

          {socials.length < MIN_NUM_OF_SOCIALS && isSubmitted && (
            <ErrorMsg
              error={{
                message: `Require atleast ${MIN_NUM_OF_SOCIALS} fields.`,
              }}
            />
          )}
        </div>

        <div className="mt-2 mx-auto flex gap-4">
          <button className="button bg-red-500 hover:bg-red-400 text-white" type="button" onClick={() => reset()}>
            Reset
          </button>
          <button type="submit" className="button button-primary">
            Submit
          </button>
        </div>
      </form>

      <FieldArrayPitfall />
    </div>
  );
};
