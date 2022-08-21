import { ChangeEventHandler, useState } from "react";
import cn from "classnames";
import Button from "@Components/Button";
import InputBox from "@Components/InputBox";
import { InputNumber } from "./Core";
import JsonDisplayer from "@Src/components/JsonDisplayer";
import { TesterState } from "./types";
import Select from "@Src/components/Select";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const styles = {
  line: "flex justify-between items-center gap-2",
};

const initialState: TesterState = {
  value: 0,
  maxValue: 100,
  minValue: 0,
  groupingSeparator: ".",
  decimalSeparator: ",",
  maxFractionalDigits: 2,
  upDownStep: 1,
  changeMode: "onChange",
  validateMode: "onChangePrevent",
  exceedMaxDigitsAction: "prevent",
};

const lines: Array<{
  label: string;
  key: keyof TesterState;
  type: string;
  options?: string[];
}> = [
  { label: "Value", key: "value", type: "number" },
  { label: "Maximum", key: "maxValue", type: "number" },
  { label: "Minimum", key: "minValue", type: "number" },
  { label: "Grouping Separator", key: "groupingSeparator", type: "text" },
  { label: "Decimal Separator", key: "decimalSeparator", type: "text" },
  { label: "Max Decimal Digits", key: "maxFractionalDigits", type: "number" },
  { label: "Increase / Decrease Step", key: "upDownStep", type: "number" },
  {
    label: "Change Mode",
    key: "changeMode",
    type: "select",
    options: ["onChange", "onBlur"],
  },
  {
    label: "Validate Mode",
    key: "validateMode",
    type: "select",
    options: ["onChangePrevent", "onChangeSetBack", "onBlur"],
  },
  {
    label: "Exceed Max Digits Action",
    key: "exceedMaxDigitsAction",
    type: "select",
    options: ["prevent", "round"],
  },
];

export default function FormatAndLimitNumber() {
  const [test, setTest] = useState(initialState);
  const { t } = useTranslation();

  const { control, register, getValues } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const inputConfig = {
    money: register("money", {
      required: {
        value: true,
        message: t("Required", { field: t("Amount from previous shift"), ns: "validation" }),
      },
      min: { value: 0, message: t("Min value", { value: 0, ns: "validation" }) },
      max: { value: 999999, message: t("Max value", { value: 999999, ns: "validation" }) },
    }),
  };

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    setTest((prev) => {
      let { name, value } = e.target;
      const { type } = lines.find((line) => line.key === name) || {};

      return {
        ...prev,
        [name]: type === "number" ? +value : value,
      };
    });
  };

  const onClickRemoveButton = (key: keyof typeof test) => {
    setTest((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? initialState[key] : undefined,
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pr-4 border border-slate-300 rounded-lg">
        <InputNumber
          className="px-4 py-2 rounded-lg"
          {...test}
          // fitValue
          allowClear
          allowEmpty
          onChangeValue={(value) => {
            setTest((prev) => ({ ...prev, value }));
          }}
        />
      </div>
      {/* <Controller 
        control={control}
        name='money'
        render={({field: {onChange, ...rest}}) => (
          <InputNumber
            className="px-4 py-2 border border-slate-300 rounded-lg"
            {...inputConfig.money}
            {...rest}
            onChangeValue={(value) => {
              onChange(value);
            }}
          />
        )}
      /> */}

      <div className="mt-4 w-full flex items-start gap-4">
        <Button onClick={() => console.log(getValues())}>Click</Button>

        <div className="mb-4 flex flex-col gap-2">
          {/*  */}
          <h3 className="text-xl font-semibold">Test configs</h3>

          {lines.map(({ label, key, type, options }, index) => {
            const isDisabledInput = test[key] === undefined;

            return (
              <div key={key} className={styles.line}>
                <label>{label}</label>
                <div className="flex">
                  {type === "select" ? (
                    <Select
                      options={options || []}
                      name={key}
                      value={isDisabledInput ? options?.[0] : test[key]}
                      onChange={onChange}
                      disabled={isDisabledInput}
                    />
                  ) : (
                    <InputBox
                      type={type}
                      name={key}
                      value={isDisabledInput ? (type === "number" ? 0 : "") : test[key]}
                      onChange={onChange}
                      disabled={isDisabledInput}
                    />
                  )}
                  <Button
                    className={cn("ml-2", !isDisabledInput && "bg-red-600 hover:bg-red-500")}
                    disabled={index === 0}
                    onClick={() => onClickRemoveButton(key)}
                  >
                    {isDisabledInput ? "O" : "X"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grow flex flex-col">
          <JsonDisplayer title="Props passed down" body={test} />
        </div>
      </div>
    </div>
  );
}
