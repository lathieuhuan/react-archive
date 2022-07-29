export type ValidateMode = "onChangePrevent" | "onChangeGoBack" | "onBlur";

export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
};

export type ValidateConfig = {
  maxValue?: number;
  minValue?: number;
  maxFractionalDigits: number;
  exceedMaxDigitsAction: "cutoff" | "round";
  validateMode: ValidateMode;
};

export type Fraction = number | undefined;
