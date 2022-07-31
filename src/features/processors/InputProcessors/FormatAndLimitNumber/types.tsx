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

// assume decimalSeparator is "."
export type InputInfo = {
  value: number;
  /**
   * number of zeroes at the end of the fraction,
   * only for inputValue "0.30" when value is 0.3
   */
  trailingZeroDigits: number;
  /**
   * only for inputValue "3." when value is 3
   */
  withDecimalSeparator: boolean;
  cursorMoves: number;
};
