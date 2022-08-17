import {CSSProperties, ReactNode, InputHTMLAttributes} from 'react';

export type TesterState = {
  value: number;
  maxValue: number;
  minValue: number;
  groupingSeparator: string;
  decimalSeparator: string;
  maxFractionalDigits: number;
  upDownStep: number;
  changeMode: 'onChange' | 'onBlur';
  validateMode: 'onChangePrevent' | 'onChangeSetBack' | 'onBlur';
  exceedMaxDigitsAction: ExceedMaxDigitsAction;
};

export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
};

export type ExceedMaxDigitsAction = 'prevent' | 'round';

export type ValidateConfig = {
  maxValue: number;
  minValue: number;
  maxFractionalDigits: number;
  exceedMaxDigitsAction: ExceedMaxDigitsAction;
  validateMode: 'onChangePrevent' | 'onChangeSetBack' | 'onBlur';
};

export type ValidateFractionConfig = Pick<
  ValidateConfig,
  'maxFractionalDigits' | 'exceedMaxDigitsAction'
>;

export interface IInputNumberProps extends Partial<FormatConfig>, Partial<ValidateConfig>, InputHTMLAttributes<HTMLInputElement> {
  value: number;
  upDownStep?: number;
  changeMode?: 'onChange' | 'onBlur';
  /**
   * For now:
   * Validate: only works when validateMode 'onBlur', validate inputValue onChangeSetBack.
   * ChangeValue: only works when changeMode 'onBlur', 'validate' then change value.
   * Blur: validate and change value according to validateMode and changeMode.
   */
  enterActions?: ('validate' | 'changeValue' | 'blur')[];
  loading?: boolean;
  /**
   * Default to false, no clear icon at the end
   */
  allowClear?: boolean;
  /**
   * Show '' instead of '0' onBlur. Default to false.
   * To be improved: validate, check if minValue > 0, what's expected behavior?
   */
  allowEmpty?: boolean;
  /**
   * Input box shrink and stretch with value length. Default to false.
   */
  shouldFitValue?: boolean;
  controllers?: Array<{ disabled: boolean }>;
  style?: CSSProperties;
  renderSuffix?: () => ReactNode;
  onChangeValue?: (value: number) => void;
  onValidateFailed?: OnValidateFailedHandler;
}

export type ErrorReport = {
  failCase: 'minValue' | 'maxValue'
  records: (number | string)[]
  message: string
}

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
