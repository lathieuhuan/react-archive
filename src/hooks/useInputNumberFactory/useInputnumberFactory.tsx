import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRunAfterPaint } from "../useRunAfterPaint";
import { ALLOWED_KEYS, CONFIG_DECIMAL_NUMBER, MAXIMUM } from "./constants";

import {
  InputInfo,
  IUseInputNumberFactoryArgs,
  OnChangeInputValueConfig,
  UpdateInputValueArgs,
  ValidateConfig,
} from "./types";

import { limitFractionDigits, initInputInfo, validateInputInfo, convertToInputValue, getFullValidate } from "./utils";

export function useInputNumberFactory({
  value,
  groupingSeparator = CONFIG_DECIMAL_NUMBER.groupingSeparator,
  decimalSeparator = CONFIG_DECIMAL_NUMBER.decimalSeparator,
  changeMode = "onChange",
  validateMode = "onChangePrevent",
  enterActions = [],
  allowEmpty = false,
  onChangeValue,
}: IUseInputNumberFactoryArgs = {}) {
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const runAfterPaint = useRunAfterPaint();

  const format = {
    groupingSeparator,
    decimalSeparator,
  };

  useEffect(() => {
    if (value === undefined || value === null || isNaN(value)) {
      setInputValue("");
      return;
    }
    if (value === 0 && inputValue === "" && inputRef.current === document.activeElement) {
      return;
    }

    let newInputValue = convertToInputValue({ value, cursorMoves: MAXIMUM }, format);

    if (newInputValue !== inputValue) {
      setInputValue(newInputValue);

      // sync value with inputValue (?)
      const inputInfo = initInputInfo(newInputValue, format);
      updateValue(inputInfo.value);
    }
  }, [value]);

  const updateValue = (newValue: number) => {
    if (newValue !== value && typeof onChangeValue === "function") {
      onChangeValue(newValue);
    }
  };

  function updateInputValue({ newCursor = null, validate, value, ...valueInfo }: UpdateInputValueArgs = {}) {
    if (value === undefined || value === null || isNaN(value)) {
      return;
    }
    const inputInfo = {
      value,
      cursorMoves: 0,
      trailingZeroDigits: 0,
      withDecimalSeparator: false,
      ...valueInfo,
    };

    const newInputValue = convertToInputValue(inputInfo, format, validate?.maxFractionalDigits);

    if (newInputValue !== inputValue) {
      setInputValue(newInputValue);

      if (changeMode === "onChange") {
        updateValue(value);
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
        console.log(newCursor);
        inputRef.current?.setSelectionRange(newCursor, newCursor);
      });
    }
  }

  function onChangeInputValue(e: ChangeEvent<HTMLInputElement>, config?: OnChangeInputValueConfig) {
    const { value } = e.target;
    const { validate, onValidateFailed } = config || {};

    try {
      if (["-", ""].includes(value)) {
        setInputValue(value);

        if (changeMode === "onChange" && typeof onChangeValue === "function") {
          onChangeValue(0);
        }
        return;
      }

      const inputInfo = initInputInfo(value, format);

      if (validateMode === "onBlur") {
        // default validate
        validateInputInfo(inputInfo);
      } else if (validate) {
        validateInputInfo(inputInfo, validate, { format, onValidateFailed });
      }

      updateInputValue({ ...inputInfo, newCursor: e.target.selectionStart, validate });
    } catch (error) {
      //
    }
  }

  /**
   * Prevent unexpected keys making cursor move... Run this after other custom keyboardEventHandlers.
   * Fire before onChange on the input, preventDefault will not lead to onChange.
   */
  function onKeyDownInput(e: KeyboardEvent<HTMLInputElement>, validate?: Partial<ValidateConfig>) {
    const fullValidate = getFullValidate(validate);

    if (e.key === "Enter" && enterActions.length) {
      const inputInfo = initInputInfo(inputValue, format);

      const validateOnEnter = () => {
        validateInputInfo(inputInfo, {
          ...fullValidate,
          validateMode: "onChangeSetBack",
        });

        const newInputValue = convertToInputValue(inputInfo, format, fullValidate.maxFractionalDigits);

        if (newInputValue !== inputValue) {
          setInputValue(newInputValue);
        }
      };

      if (enterActions.includes("changeValue")) {
        if (changeMode === "onBlur") {
          validateOnEnter();
          updateValue(inputInfo.value);
        }
      } else if (enterActions.includes("validate")) {
        if (validateMode === "onBlur") {
          validateOnEnter();
        }
      } else if (enterActions.includes("blur")) {
        inputRef.current?.blur();
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
      if (fullValidate.minValue < 0 && selectionStart === 0) {
        return;
      }
    } else if (e.key === format.decimalSeparator) {
      if (fullValidate.maxFractionalDigits > 0) {
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
          (selectionEnd &&
            e.key === "Backspace" &&
            beforeInputValue.slice(selectionStart, selectionEnd) === format.groupingSeparator)
        ) {
          e.preventDefault();
        }
      }
      return;
    }
    e.preventDefault();
  }

  // const onBlurInput: FocusEventHandler<HTMLInputElement> = (e) => {
  //   try {
  //     const inputInfo = initInputInfo(inputValue, format);

  //     if (validateMode === 'onBlur') {
  //       validateInputInfo(inputInfo, {
  //         ...validate,
  //         validateMode: "onChangeSetBack", // set back when out of range
  //       });
  //     }
  //     if (changeMode === "onBlur") {
  //       updateValue(inputInfo.value);
  //     }

  //     let newInputValue = convertToInputValue(
  //       {
  //         ...inputInfo,
  //         trailingZeroDigits: 0,
  //         withDecimalSeparator: false,
  //       },
  //       format,
  //       validate
  //     );

  //     if (newInputValue === "0" && allowEmpty) {
  //       newInputValue = "";
  //     }

  //     setInputValue(newInputValue);
  //   } catch (error) {
  //     //
  //   }
  // };

  return {
    ref: inputRef,
    inputValue,
    onKeyDownInput,
    onChangeInputValue,
    setInputValue,
    updateInputValue,
  };
}
