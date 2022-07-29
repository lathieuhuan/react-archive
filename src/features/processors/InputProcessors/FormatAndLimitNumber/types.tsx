export type FormatConfig = {
  groupingSeparator: string;
  decimalSeparator: string;
  maxFractionalDigits: number;
  exceedMaxDigitsAction: "cutoff" | "round"
}

export type Fraction = number | undefined;