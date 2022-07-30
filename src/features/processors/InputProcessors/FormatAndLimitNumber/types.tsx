export type TesterState = {
  value: number;
  maxValue: number;
  minValue: number;
  groupingSeparator: string;
  decimalSeparator: string;
  maxFractionalDigits: number;
  upDownStep: number;
  changeMode: ChangeMode;
  validateMode: ValidateMode;
  exceedMaxDigitsAction: ExceedMaxDigitsAction;
};

export type ChangeMode = "onChange" | "onBlur";

export type ValidateMode = "onChangePrevent" | "onChangeSetBack" | "onBlur";

export type ExceedMaxDigitsAction = "prevent" | "round";

export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
};

export type ValidateConfig = {
  maxValue: number;
  minValue: number;
  maxFractionalDigits: number;
  exceedMaxDigitsAction: ExceedMaxDigitsAction;
  validateMode: ValidateMode;
};

export type ValidateFractionConfig = Pick<
  ValidateConfig,
  "maxFractionalDigits" | "exceedMaxDigitsAction"
>;

export type InputState = {
  newValue: number;
  wholeAsString: string;
  fraction: number;
  withDecimalSeparator: boolean;
  newCursor: number | null;
  cursorMoves: number;
};
