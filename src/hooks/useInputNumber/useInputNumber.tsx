import { ChangeEvent, FocusEvent, KeyboardEvent, useRef, useState } from "react";
import { useRunAfterPaint } from "../useRunAfterPaint";

import { RegisterConfig, IUseInputNumberArgs, UpdateInputValuesArgs, ErrorReport } from "./types";
import { initInputInfo, validateInputInfo, convertToInputValue } from "./utils";
import { ALLOWED_KEYS, CONFIG_DECIMAL_NUMBER, MAXIMUM } from "./constants";

const DEFAULT_KEY = "undefined";

// Corner case: Add decimalSeparator (.) to '123,456,789' after digit 1 to make '1.23456789'
// Remove this decimalSeparator, cursor is pushed to the right by 2 because 2 groupingSeparators
// were added (see convertToInputValue)

// #to-do:
// use validateOnSync when syncing inputValue with value
// changeMode 'onChange', validateMode 'onBlur' => when blur not change value back
// changeMode 'onBlur', validateMode 'onBlur' => cannot change inputValue due to value immediately change it back

/**
 * 'inputValue' is the formatted value on the input.
 * 'value' is the value converted from inputValue, is number when succeed, undefined when failed.
 */
export function useInputNumber({
  groupingSeparator = CONFIG_DECIMAL_NUMBER.groupingSeparator,
  decimalSeparator = CONFIG_DECIMAL_NUMBER.decimalSeparator,
  changeMode = "onChange",
  validateMode = "onChangePrevent",
  exceedMaxFractionDigitsAction = "prevent",
  validateOnSync = {},
  enterActions = {},
  focusActions = {},
}: IUseInputNumberArgs = {}) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const valuesRef = useRef<Record<string, number | undefined>>({});
  const runAfterPaint = useRunAfterPaint();

  const format = {
    groupingSeparator,
    decimalSeparator,
  };

  function register(config: RegisterConfig = {}) {
    const {
      name = DEFAULT_KEY,
      value,
      maxValue = MAXIMUM,
      minValue = 0,
      maxFractionDigits = 0,
      onChangeValue,
      onValidateFailed,
    } = config;

    if (minValue * maxValue > 0) {
      validateMode = "onBlur";
    }

    const validate = {
      maxValue,
      minValue,
      maxFractionDigits,
      exceedMaxFractionDigitsAction,
      validateMode,
    };

    const updateValue = (newValue: number | undefined) => {
      if (typeof onChangeValue === "function") {
        onChangeValue(newValue);
      }
    };

    // sync inputValue with value
    // need to handle case value is invalid (undefined, null...)
    // if (
    //   value !== undefined &&
    //   value !== null &&
    //   !isNaN(value) &&
    //   (valuesRef.current[name] === undefined || valuesRef.current[name] !== value)
    // ) {
    //   const inputInfo = {
    //     value,
    //     trailingZeroDigits: 0,
    //     isNegative: false,
    //     cursorMoves: 0,
    //     withDecimalSeparator: false,
    //   };

    //   try {
    //     validateInputInfo(inputInfo, { format, validate, onValidateFailed });
    //     updateInputValue({ name, value: inputInfo.value });
    //   } catch (error) {
    //     if (typeof onValidateFailed === "function") {
    //       onValidateFailed(error as ErrorReport);
    //     }
    //     // validate failed, change value and back to before
    //     updateValue(valuesRef.current[name]);
    //   }

    //   valuesRef.current[name] = value;
    // }

    if ('value' in config) {
      if (value === undefined && valuesRef.current[name] !== undefined) {
        setInputValues((prev) => ({...prev, [name]: ''}));
        valuesRef.current[name] = undefined;
      } else if (value !== undefined && value !== valuesRef.current[name]) {
        updateInputValue({ name, value });
      }
    }

    function onFocus(e: FocusEvent<HTMLInputElement>) {
      if (focusActions.clearZero && inputValues[name] === "0") {
        setInputValues((prev) => ({ ...prev, [name]: "" }));
      }
      if (focusActions.selectAll) {
        inputsRef.current[name]?.setSelectionRange(0, 50);
      }
    }

    /**
     * Prevent unexpected keys making cursor move... Run this after other custom keyboardEventHandlers.
     * Fire before onChange on the input, preventDefault will not lead to onChange.
     */
    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter" && Object.keys(enterActions).length) {
        const inputInfo = initInputInfo(inputValues[name], format);

        const validateOnEnter = () => {
          validateInputInfo(inputInfo, {
            validate: {
              ...validate,
              validateMode: "onChangeSetBack",
            },
          });

          const newInputValue = convertToInputValue(inputInfo, format, validate.maxFractionDigits);

          if (newInputValue !== inputValues[name]) {
            setInputValues((prev) => ({ ...prev, [name]: newInputValue }));
          }
        };

        if (enterActions.changeValue) {
          if (changeMode === "onBlur") {
            validateOnEnter();
            updateValue(inputInfo.value);
          }
        } else if (enterActions.validate) {
          if (validateMode === "onBlur") {
            validateOnEnter();
          }
        } else if (enterActions.blur) {
          inputsRef.current?.[name]?.blur();
        }

        return;
      }
      // allow all ctrl + key
      if (e.ctrlKey) {
        return;
      }
      // selectionStart, selectionEnd when before any action
      const { value: beforeInputValue, selectionStart, selectionEnd } = e.currentTarget;

      if (e.key === "-") {
        // only allow '-' at the start when min is negative
        if (selectionStart === 0 && validate.minValue < 0) {
          return;
        }
      } else if (e.key === decimalSeparator) {
        if (validate.maxFractionDigits > 0) {
          return;
        }
      } else if (/[0-9]/g.test(e.key) || ALLOWED_KEYS.includes(e.key)) {
        if (selectionStart && selectionEnd) {
          // prevent removing groupingSeparator
          if (selectionStart === selectionEnd) {
            if (
              (e.key === "Backspace" &&
                beforeInputValue.slice(selectionStart - 1, selectionStart) === groupingSeparator) ||
              (e.key === "Delete" && beforeInputValue.slice(selectionStart, selectionStart + 1) === groupingSeparator)
            ) {
              e.preventDefault();
            }
          } else if (
            ["Backspace", "Delete"].includes(e.key) &&
            beforeInputValue.slice(selectionStart, selectionEnd) === groupingSeparator
          ) {
            e.preventDefault();
          }
        }
        return;
      }
      e.preventDefault();
    }

    /**
     * @returns the value equivalent of inputValue
     */
    function onChange(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      try {
        if (["-", ""].includes(value)) {
          setInputValues((prev) => ({ ...prev, [name]: value }));
          valuesRef.current[name] = undefined;

          if (changeMode === "onChange") {
            updateValue(undefined);
          }
          return;
        }

        const inputInfo = initInputInfo(value, format);

        if (validateMode === "onBlur") {
          // default validate
          validateInputInfo(inputInfo, {
            validate: {
              maxValue: MAXIMUM,
              minValue: -MAXIMUM,
              maxFractionDigits: 6, // for now, to prevent 0.0000001 => 1e-7
              exceedMaxFractionDigitsAction: "prevent",
              validateMode: "onChangePrevent",
            },
          });
        } else {
          validateInputInfo(inputInfo, { format, validate, onValidateFailed });
        }

        const newValue = updateInputValue(
          {
            name,
            ...inputInfo,
            newCursor: e.target.selectionStart,
            maxFractionDigits: validate.maxFractionDigits,
          },
          onChangeValue
        );

        return newValue;
      } catch (error) {
        if (typeof onValidateFailed === "function") {
          onValidateFailed(error as ErrorReport);
        }
      }
    }

    function onBlur(e: FocusEvent<HTMLInputElement>) {
      try {
        const inputInfo = initInputInfo(inputValues[name], format);

        if (validateMode === "onBlur") {
          validateInputInfo(inputInfo, {
            validate: {
              ...validate,
              validateMode: "onChangeSetBack", // set back when out of range
            },
          });
        }
        if (changeMode === "onBlur") {
          updateValue(inputInfo.value);
        }

        let newInputValue = convertToInputValue(
          {
            ...inputInfo,
            trailingZeroDigits: 0,
            withDecimalSeparator: false,
            // '-0' and '0' are treated the same onBlur
            isNegative: inputInfo.value === 0 ? false : inputInfo.isNegative,
          },
          format,
          validate.maxFractionDigits
        );

        if (newInputValue === "0") {
          newInputValue = "";
        }

        setInputValues((prev) => ({ ...prev, [name]: newInputValue }));
      } catch (error) {
        if (typeof onValidateFailed === "function") {
          onValidateFailed(error as ErrorReport);
        }
      }
    }

    return {
      ref: (el: HTMLInputElement | null) => {
        inputsRef.current[name] = el;
      },
      value: inputValues[name] || "",
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
    };
  }

  function updateInputValue(args: UpdateInputValuesArgs, onChange?: (value?: number) => void) {
    const { name, value, maxFractionDigits, ...valueInfo } = args;
    
    if (!value) {
      setInputValues((prev) => ({ ...prev, [name]: '' }));
      valuesRef.current[name] = undefined;
      return;
    }

    let newCursor = args.newCursor || null;

    const inputInfo = {
      value,
      cursorMoves: 0,
      trailingZeroDigits: 0,
      withDecimalSeparator: false,
      ...valueInfo,
    };

    const newInputValue = convertToInputValue(inputInfo, format, maxFractionDigits);

    if (changeMode === "onChange" && typeof onChange === "function") {
      onChange(value);
    }

    setInputValues((prev) => ({ ...prev, [name]: newInputValue }));
    valuesRef.current[name] = value;

    // update cursor position
    runAfterPaint(() => {
      if (newCursor !== null) {
        // keep cursor after 0 (0 is intended to not be removed)
        if (["0", "-0"].includes(newInputValue)) {
          newCursor++;
        } else {
          newCursor += inputInfo.cursorMoves;
        }
        newCursor = Math.max(newCursor, 0);
      }
      inputsRef.current?.[name]?.setSelectionRange(newCursor, newCursor);
    });

    return value;
  }

  return {
    value: valuesRef.current.undefined,
    values: valuesRef.current,
    register,
    updateInputValue,
  };
}
