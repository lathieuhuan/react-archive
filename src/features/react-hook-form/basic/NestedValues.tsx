import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../../components/Button";
import InputBox from "../../../components/InputBox";
import { showNotify } from "../../../utils";
import { ErrorMsg } from "../components";

import { NestedFormField } from "../types";
import { COLORS } from "../constant";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

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

export default function NestedValues() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    // trigger,
    formState: { errors },
  } = useForm<NestedFormField>({
    mode: "onTouched",
    // shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      fullname: {
        firstname: "",
        lastname: "",
      },
      colors: [],
      socials: [{ type: "", url: "" }],
    },
    resolver: yupResolver(schema),
  });
  const formState = useFormState({ control });
  // const socialsTouched = formState.touchedFields.socials;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "socials",
    }
  );

  const socials = watch("socials");
  const lastSocial = socials[socials.length - 1];
  const socialsNotAddable = !lastSocial.type || !lastSocial.url;

  const onSubmit: SubmitHandler<NestedFormField> = (data) => {
    showNotify({
      message: "Submitted Info",
      description: data,
    });
  };

  return (
    <div className="max-w-xl">
      <p className="mb-2 italic text-right text-slate-400">Validate with Yup</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <div className="grid grid-cols-2 gap-2">
            <InputBox
              placeholder="Enter first name"
              {...register("fullname.firstname")}
            />
            <InputBox
              placeholder="Enter last name"
              {...register("fullname.lastname")}
            />
          </div>
          <ErrorMsg
            error={errors.fullname?.firstname || errors.fullname?.lastname}
          />
        </div>

        <div className="flex flex-col">
          <p className="text-lg">Choose colors</p>
          <ul className="pl-2 flex gap-4">
            {COLORS.map((color) => {
              return (
                <li key={color} className="mt-2">
                  <label>
                    <input
                      className="mr-2"
                      type="checkbox"
                      {...register("colors")}
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
                    <InputBox
                      placeholder="Enter social type"
                      {...register(`socials.${i}.type`)}
                    />
                    <InputBox
                      placeholder="Enter social url"
                      {...register(`socials.${i}.url`)}
                    />
                    <button
                      className="w-10 min-w-[40px] bg-red-200 hover:bg-red-300 text-black rounded"
                      onClick={() => remove(i)}
                      disabled={socials.length === 1}
                    >
                      <MinusOutlined />
                    </button>
                  </div>
                  <ErrorMsg
                    error={
                      errors.socials?.[i]?.type || errors.socials?.[i]?.url
                    }
                  />
                </div>
              );
            })}
          </div>
          <Button
            className="mt-4 w-full h-10 bg-green-200 hover:bg-green-300 text-black"
            type="button"
            onClick={() => {
              append({ type: "", url: "" }, { shouldFocus: false });
              // trigger("socials"); // async
            }}
            disabled={socialsNotAddable}
          >
            <PlusOutlined />
          </Button>
          {socials.length < MIN_NUM_OF_SOCIALS && formState.isSubmitted && (
            <p className="mt-2 text-red-500">
              Require atleast {MIN_NUM_OF_SOCIALS} fields.
            </p>
          )}
        </div>

        <div className="mt-2 mx-auto flex gap-4">
          <Button
            className="bg-red-500 hover:bg-red-400"
            type="button"
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>

      <Pitfall />
    </div>
  );
}

function Pitfall() {
  return (
    <div className="mt-6">
      <h4 className="text-xl text-purple-700">
        Pitfall: display errors on socials
      </h4>
      <div className="mt-2 px-4 py-2 rounded border-1 border-slate-300 flex flex-col gap-2">
        <div>
          <h5 className="text-blue-600 font-bold">Case:</h5>
          <ul className="list-disc list-inside">
            <li>Require atleast n fields.</li>
            <li>Required type & url on each field.</li>
            <li>Number of default fields is less than n.</li>
          </ul>
        </div>

        <p>
          <b className="text-blue-600">Behaviour:</b> Submit and get error about
          number of fields on socials. Add more field to reach n but error does
          not change.
        </p>

        <div>
          <h5 className="text-red-600">Try 1:</h5>
          <p className="indent-4">
            Manually re-validate socials (with trigger) when adding new field,
            but doing so will validate the newly added field which has not been
            touched.
          </p>
          <p className="indent-4">
            Check socialsTouched before render error will not show error in case
            user has not touched the field but submit with less than n fields.
          </p>
        </div>

        <p>
          <b className="text-green-600">Final Solution:</b> Check socials.length{" "}
          {"<"} n && formState.isSubmitted to render error.
        </p>
      </div>

      <div className="mt-2 px-4 py-2 rounded border-1 border-slate-300 flex flex-col gap-2">
        <div>
          <p>
            <b className="text-blue-600">Case:</b> like above
          </p>
        </div>

        <p>
          <b className="text-blue-600">Behaviour:</b> Change type or url of a
          field, these values will not be validated when number of fields is
          less than n. Resolver validates that criteria first and stop there on
          error, although criteriaMode is "all".
        </p>
      </div>
    </div>
  );
}
