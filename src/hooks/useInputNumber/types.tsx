export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
};

type ValidateValue = {
  maxValue: number;
  minValue: number;
  maxFractionDigits: number;
};

type ValidateAction = {
  validateMode: "onChangePrevent" | "onChangeSetBack" | "onBlur";
  exceedMaxFractionDigitsAction: "prevent" | "round";
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

export interface IUseInputNumberToolkitArgs extends Partial<FormatConfig>, Partial<ValidateAction> {
  changeMode?: "onChange" | "onBlur";
}

export type ValidateConfig = ValidateValue & ValidateAction;

export type ValidateFractionConfig = Pick<ValidateConfig, "maxFractionDigits" | "exceedMaxFractionDigitsAction">;

export type RegisterConfig = Partial<ValidateValue> & {
  name?: string;
  /**
   * Used to sync inputValue with value when value is controlled by something else
   */
  value?: number | null;
  /**
   * Used for connecting to outside state.
   */
  onChangeValue?: (value: number) => void;
  /**
   * Callback fired when validate failed.
   */
  onValidateFailed?: OnValidateFailedHandler;
};

export type Config = {
  format?: FormatConfig;
  validate: ValidateConfig;
  onValidateFailed?: OnValidateFailedHandler;
};

export type UpdateInputValuesArgs = Partial<InputInfo> & {
  name: string;
  value?: number | null;
  newCursor?: number | null;
  maxFractionDigits?: number;
};
