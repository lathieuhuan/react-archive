import cn from "classnames";
import { ChangeEventHandler, useState } from "react";

import Select from "@Components/Select";
import InputBox from "@Components/InputBox";
import JsonDisplayer from "@Src/components/JsonDisplayer";
import { InputNumber } from "./Core";
import { TesterState } from "./types";

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

export const InputNumberExample = () => {
  const [test, setTest] = useState(initialState);

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
      <div className="mt-4 w-full flex items-start gap-4">
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
                      options={options?.map((option) => ({ label: option })) || []}
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
                  <button
                    className={cn("ml-2 button", isDisabledInput ? "button-primary" : "button-danger")}
                    disabled={index === 0}
                    onClick={() => onClickRemoveButton(key)}
                  >
                    {isDisabledInput ? "O" : "X"}
                  </button>
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
};
