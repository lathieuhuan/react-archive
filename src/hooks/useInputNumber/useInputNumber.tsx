import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRunAfterPaint } from "../useRunAfterPaint";
import { ALLOWED_KEYS, CONFIG_DECIMAL_NUMBER, MAXIMUM } from "./constants";

import { RegisterConfig, InputInfo, IUseInputNumberToolkitArgs, UpdateInputValuesArgs, ValidateConfig } from "./types";

import { limitFractionDigits, initInputInfo, validateInputInfo, convertToInputValue } from "./utils";

const DEFAULT_KEY = "undefined";

export function useInputNumber({
  groupingSeparator = CONFIG_DECIMAL_NUMBER.groupingSeparator,
  decimalSeparator = CONFIG_DECIMAL_NUMBER.decimalSeparator,
  changeMode = "onChange",
  validateMode = "onChangePrevent",
  exceedMaxFractionDigitsAction = "round",
  enterActions = {},
  focusActions = {},
  allowEmpty,
}: IUseInputNumberToolkitArgs = {}) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const valuesRef = useRef<Record<string, number>>({});
  const runAfterPaint = useRunAfterPaint();

  const format = {
    groupingSeparator,
    decimalSeparator,
  };

  function register(config?: RegisterConfig) {
    const {
      name = DEFAULT_KEY,
      value,
      maxValue = MAXIMUM,
      minValue = 0,
      maxFractionDigits = 0,
      onChangeValue,
      onValidateFailed,
    } = config || {};

    if (inputValues[name] === undefined) {
      inputValues[name] = "";
    }
    if (
      value !== undefined &&
      value !== null &&
      !isNaN(value) &&
      (valuesRef.current[name] === undefined || valuesRef.current[name] !== value)
    ) {
      valuesRef.current[name] = value;
      updateInputValue({ name, value });
    }

    const validate = {
      maxValue,
      minValue,
      maxFractionDigits: Math.max(maxFractionDigits, 0),
      exceedMaxFractionDigitsAction,
      validateMode,
    };

    const updateValue = (newValue: number) => {
      if (typeof onChangeValue === "function") {
        onChangeValue(newValue);
      }
    };

    // return value after
    function onChange(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      try {
        if (["-", ""].includes(value)) {
          // case: from "3" to "" in Most Basic, value is still 3, set to 0 or min?
          // valuesRef.current[name] = 0;
          setInputValues((prev) => ({ ...prev, [name]: value }));

          if (changeMode === "onChange" && typeof onChangeValue === "function") {
            onChangeValue(0);
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
        //
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
        if (validate.minValue < 0 && selectionStart === 0) {
          return;
        }
      } else if (e.key === format.decimalSeparator) {
        if (validate.maxFractionDigits > 0) {
          return;
        }
      } else if (/[0-9]/g.test(e.key) || ALLOWED_KEYS.includes(e.key)) {
        if (selectionStart) {
          // prevent removing groupingSeparator
          if (
            (e.key === "Backspace" &&
              beforeInputValue.slice(selectionStart - 1, selectionStart) === format.groupingSeparator) ||
            (e.key === "Delete" &&
              beforeInputValue.slice(selectionStart, selectionStart + 1) === format.groupingSeparator) ||
            (["Backspace", "Delete"].includes(e.key) &&
              selectionEnd &&
              beforeInputValue.slice(selectionStart, selectionEnd) === format.groupingSeparator)
          ) {
            e.preventDefault();
          }
        }
        return;
      }
      e.preventDefault();
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
          },
          format,
          validate.maxFractionDigits
        );

        if (newInputValue === "0" && allowEmpty) {
          newInputValue = "";
        }

        setInputValues((prev) => ({ ...prev, [name]: newInputValue }));
      } catch (error) {
        //
      }
    }

    function onFocus(e: FocusEvent<HTMLInputElement>) {
      if (focusActions.clearZero && inputValues[name] === "0") {
        setInputValues((prev) => ({ ...prev, [name]: "" }));
      }
      if (focusActions.selectAll) {
        inputsRef.current[name]?.setSelectionRange(0, 20);
      }
    }

    return {
      ref: (el: HTMLInputElement | null) => {
        inputsRef.current[name] = el;
      },
      value: inputValues[name],
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
    };
  }

  function updateInputValue(args: UpdateInputValuesArgs, onChange?: (value: number) => void) {
    const { name, value, maxFractionDigits, ...valueInfo } = args;
    let newCursor = args.newCursor || null;

    if (value === undefined || value === null || isNaN(value)) {
      return 0;
    }

    const inputInfo = {
      value,
      cursorMoves: 0,
      trailingZeroDigits: 0,
      withDecimalSeparator: false,
      ...valueInfo,
    };

    const newInputValue = convertToInputValue(inputInfo, format, maxFractionDigits);

    if (newInputValue !== inputValues[name]) {
      valuesRef.current[name] = value;
      setInputValues((prev) => ({ ...prev, [name]: newInputValue }));

      if (changeMode === "onChange" && typeof onChange === "function") {
        onChange(value);
      }

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
    }

    return value;
  }

  return {
    value: valuesRef.current.undefined,
    values: valuesRef.current,
    register,
  };
}
