export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
};

type Value = number | null;

type ValidateMode = "onChangePrevent" | "onChangeSetBack" | "onBlur";

export type ValidateConfig = {
  maxValue: number;
  minValue: number;
  maxFractionalDigits: number;
  exceedMaxDigitsAction: "prevent" | "round";
  validateMode: ValidateMode;
};

export type ValidateFractionConfig = Pick<ValidateConfig, "maxFractionalDigits" | "exceedMaxDigitsAction">;

export interface IUseInputNumberFactoryArgs extends Partial<FormatConfig> {
  value?: Value;
  changeMode?: "onChange" | "onBlur";
  validateMode?: ValidateMode;
  /**
   * For now:
   * Validate: only works on validateMode 'onBlur', validate inputValue 'onChangeSetBack',
   * need to provide validate 'onKeyDown'.
   * ChangeValue: only works on changeMode 'onBlur', change value without validate.
   * Blur: validate and change value according to validateMode and changeMode.
   */
  enterActions?: ("validate" | "changeValue" | "blur")[];
  /**
   * Show '' instead of '0' onBlur. Default to false.
   * To be improved: validate, check if minValue > 0, what's expected behavior?
   */
  allowEmpty?: boolean;
  onChangeValue?: (value: number) => void;
}

export type OnChangeInputValueConfig = {
  validate?: Partial<ValidateConfig>;
  onValidateFailed?: OnValidateFailedHandler;
};

export type UpdateInputValueArgs = Partial<InputInfo> & {
  newCursor?: number | null;
  validate?: Partial<ValidateConfig>;
};

export type ErrorReport = {
  failCase: "minValue" | "maxValue";
  records: (number | string)[];
  message: string;
};

export type OnValidateFailedHandler = (args: ErrorReport) => void;

// assume decimalSeparator is "."
export type InputInfo = {
  value: number;
  /**
   * Number of zeroes at the end of the fraction,
   * only for inputValue "0.30" when value is 0.3
   */
  trailingZeroDigits: number;
  /**
   * Only for inputValue "3." when value is 3
   */
  withDecimalSeparator: boolean;
  cursorMoves: number;
};
