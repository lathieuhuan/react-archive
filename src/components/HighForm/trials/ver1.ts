import { Store } from "antd/es/form/interface";
import { DisableRule, DisableSubRule } from "../types";

// any DisableRule true make field disabled
const formDisableRules: Record<string, DisableRule[]> = {
  name: [
    // Any option true enable input (all false => disabled)
    // {
    //   allOf: {
    //     isA: [false, undefined],
    //     isB: [false, undefined],
    //     isC: [false, undefined],
    //   },
    // },
    // All options true enable input (any false => disabled)
    // {
    //   anyOf: {
    //     isA: [false, undefined],
    //     isB: [false, undefined],
    //     isC: [false, undefined],
    //   },
    // },
    // 1 option true, 1 of 2 options true (!isA || (!isB && !isC) => disabled)
    // {
    //   allOf: {
    //     isA: [false, undefined],
    //   },
    // },
    // {
    //   allOf: {
    //     isB: [false, undefined],
    //     isC: [false, undefined],
    //   },
    // },
    //
    {
      allOf: {
        isA: [false, undefined],
      },
      anyOf: {
        isB: true,
        isC: true,
      },
    },
  ],
};

interface ICheckAndDisableSubRuleArgs {
  changedKey: string;
  affectedKey: string;
  subRule?: DisableSubRule;
  isCheckingAll: boolean;
  ruleIndex: number;
}

export const checkAndDisableV1 = <T extends Store>(
  disables: Partial<Record<keyof T, boolean[]>>,
  setDisables: Function
) => {
  return (changedValues: Partial<T>, values: T) => {
    // console.log(changedValues, values);

    const newDisables = { ...disables };
    let didChange = false;

    const checkSubRule = ({
      changedKey,
      affectedKey,
      isCheckingAll,
      ruleIndex,
      subRule,
    }: ICheckAndDisableSubRuleArgs) => {
      if (subRule && changedKey in subRule) {
        const affectedField = affectedKey as keyof T;
        let shouldDisable = isCheckingAll;

        for (const dependencyKey in subRule) {
          const refValue = subRule[dependencyKey];
          const fieldvalue = values[dependencyKey as keyof T];
          const valueIsGood = Array.isArray(refValue) ? refValue.includes(fieldvalue) : fieldvalue === refValue;

          if (isCheckingAll ? !valueIsGood : valueIsGood) {
            shouldDisable = !isCheckingAll;
            break;
          }
        }

        if (!newDisables[affectedField]) {
          newDisables[affectedField] = [];
        }

        if (newDisables[affectedField]![ruleIndex] !== shouldDisable) {
          newDisables[affectedField]![ruleIndex] = shouldDisable;
          didChange = true;
        }
      }
    };

    for (const changedKey in changedValues) {
      for (const [affectedKey, disableRules] of Object.entries(formDisableRules)) {
        disableRules.forEach((disableRule, index) => {
          checkSubRule({
            changedKey,
            affectedKey,
            subRule: disableRule.allOf,
            isCheckingAll: true,
            ruleIndex: index,
          });

          console.log(JSON.stringify(newDisables));

          checkSubRule({
            affectedKey,
            changedKey,
            subRule: disableRule.anyOf,
            isCheckingAll: false,
            ruleIndex: index,
          });

          console.log(JSON.stringify(newDisables));
        });
      }
    }

    if (didChange) {
      setDisables(newDisables);
    }
  };
};
