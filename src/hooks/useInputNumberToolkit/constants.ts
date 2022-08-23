import { ValidateConfig } from "./types";

export const MAXIMUM = Math.pow(10, 12);

export const ALLOWED_KEYS = ["Backspace", "Delete", "Enter", "ArrowLeft", "ArrowRight", "Home", "End", "Shift"];

export const CONFIG_DECIMAL_NUMBER = {
  decimalSeparator: ".",
  groupingSeparator: ",",
};

export const DEFAULT_VALIDATE: ValidateConfig = {
  maxValue: MAXIMUM,
  minValue: 0,
  maxFractionalDigits: 0,
  exceedMaxDigitsAction: "prevent",
  validateMode: "onChangePrevent",
};
