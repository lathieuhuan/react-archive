import { Store } from "antd/es/form/interface";
import { DisableRule, DisableFieldRule, PrimalType, Condition } from "../types";

const formDisableRules: Record<string, DisableRule> = {
  name: {
    checkFields: ["isA", "isB", "isC"],
    conditions: [
      // REQUIRE 1 OF MANY
      // {
      //   type: "allOf",
      //   fields: {
      //     isA: [false, undefined],
      //     isB: [false, undefined],
      //   },
      // },
      // REQUIRE ALL
      // {
      //   type: "anyOf",
      //   fields: {
      //     isA: [false, undefined],
      //     isB: [false, undefined],
      //   },
      // },
      // REQUIRE 1 SPECIFIC AND 1 OF OTHERS
      {
        type: "allOf",
        fields: {
          isA: [false, undefined],
        },
      },
      {
        type: "allOf",
        fields: {
          isB: [false, undefined],
          isC: [false, undefined],
        },
      },
    ],
  },
};

const turnArr = <T>(obj: T | T[]): T[] => (Array.isArray(obj) ? obj : [obj]);

type FormValues = Record<string, PrimalType>;

const checkFields = (values: FormValues, fieldRule: DisableFieldRule, isCheckingAll: boolean) => {
  let checkResults: boolean[] = [];

  for (const field in fieldRule) {
    const fieldValue = values[field];
    const refValue = fieldRule[field];

    if (Array.isArray(refValue)) {
      checkResults.push(refValue.includes(fieldValue));
    } else {
      checkResults.push(fieldValue === refValue);
    }
  }

  return isCheckingAll ? checkResults.every(Boolean) : checkResults.some(Boolean);
};

const checkCondition = (values: FormValues, condition: Condition) => {
  switch (condition.type) {
    case "allOf":
      return checkFields(values, condition.fields, true);
    case "anyOf":
      return checkFields(values, condition.fields, false);
    default:
      return false;
  }
};

export const checkAndDisableV1 = <T extends Store>(
  disables: Partial<Record<keyof T, boolean[]>>,
  setDisables: Function
) => {
  return (changedValues: Partial<T>, values: T) => {
    const newDisables = { ...disables };
    let didChange = false;

    for (const changedKey in changedValues) {
      for (const [affectedKey, disableRules] of Object.entries(formDisableRules)) {
        if (!disableRules.checkFields.includes(changedKey)) {
          continue;
        }

        if (!newDisables[affectedKey]) {
          newDisables[affectedKey as keyof T] = [];
        }

        turnArr(disableRules.conditions).forEach((condition, index) => {
          const disable = checkCondition(values, condition);

          if (newDisables[affectedKey]![index] !== disable) {
            newDisables[affectedKey]![index] = disable;
            didChange = true;
          }
        });
      }
    }

    console.log(didChange);
    console.log(newDisables);

    if (didChange) {
      setDisables(newDisables);
    }
  };
};
