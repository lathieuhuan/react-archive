export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
};

type ValidateMode = "onChangePrevent" | "onChangeSetBack" | "onBlur";

type ValidateValue = {
  maxValue: number;
  minValue: number;
  maxFractionDigits: number;
};

type ValidateAction = {
  /**
   * Default to 'onChangePrevent'. If 'onBlur' value will be set back when < minValue
   * or > maxValue, and fire onValidateFailed if any. Forced to 'onBlur' when (minValue * maxValue > 0).
   * Why: max 1000, min 10, validateMode 'onChange...' => cannot enter 1-9 for 1... - 9...
   */
  validateMode: ValidateMode;
  /**
   * Default to 'prevent'
   */
  exceedMaxFractionDigitsAction: "prevent" | "round";
};

export type ErrorReport = {
  failCase:
    | "format/decimalSeparator"
    | "format/maxFractionDigits"
    | "format/minusSign"
    | "format/NaN"
    | "minValue"
    | "maxValue";
  message: string;
};

export type OnValidateFailedHandler = (args: ErrorReport) => void;

// Assume decimalSeparator is "."
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
  /**
   * Add minus before inputValue or not.
   * Also to distinguish '0' and '-0', '0.' and '-0.', '0.0' and '-0.0'
   */
  isNegative: boolean;
  cursorMoves: number;
};

export interface IUseInputNumberArgs extends Partial<FormatConfig>, Partial<ValidateAction> {
  /**
   * Default to 'onChange'
   */
  changeMode?: "onChange" | "onBlur";
  /**
   * When connected to a state by passing a value and there's a third party
   * also controlling this value, validation will be carried out everytime value
   * is changed by the said party
   */
  validateOnSync?: {
    /**
     * Default to 'onChangePrevent'
     */
    mode?: Exclude<ValidateMode, "onBlur">;
    /**
     * Default to 'round'. 'round' will prevent floating-point issue
     */
    exceedMaxFractionDigitsAction?: "prevent" | "round";
  };
  enterActions?: {
    validate?: boolean;
    changeValue?: boolean;
    blur?: boolean;
  };
  focusActions?: {
    /**
     * Select all input value onFocus
     */
    selectAll?: boolean;
    /**
     * Empty input onFocus when value is 0
     */
    clearZero?: boolean;
  };
  /**
   * value when input is empty. When 0 also show 0 instead of empty on blur. Default to 'undefined'.
   * Forced to 'undefined' when (minValue > 0 || maxValue < 0)
   */
  valueWhenEmpty?: 0;
}

export type ValidateConfig = ValidateValue & ValidateAction;

export type ValidateFractionConfig = Pick<ValidateConfig, "maxFractionDigits" | "exceedMaxFractionDigitsAction"> & {
  onValidateFailed?: OnValidateFailedHandler;
};

export type RegisterConfig = Partial<ValidateValue> & {
  name?: string;
  /**
   * Used to sync inputValue with value when value is also controlled by another thing
   */
  value?: number;
  /**
   * Used for connecting to outside state
   */
  onChangeValue?: (value: number | undefined) => void;
  /**
   * Callback fired when validate failed
   */
  onValidateFailed?: OnValidateFailedHandler;
};

export type Config = {
  format?: FormatConfig;
  validate: ValidateConfig;
  onValidateFailed?: OnValidateFailedHandler;
};

export type UpdateInputValuesArgs = Omit<Partial<InputInfo>, "value"> & {
  name: string;
  value: number;
  newCursor?: number | null;
  maxFractionDigits?: number;
};
