import type { FormatConfig, ValidateConfig, ValidateFractionConfig } from "./types";

export const digitCount = (num: number) => num.toString().length;

const joinDecimal = (whole: number, fraction: number) => Number(`${whole}.${fraction}`);

const splitDecimal = (num: number) => {
  const [_, fractionPart] = num.toString().split(".");
  return [Math.floor(num), fractionPart ? +fractionPart : 0];
};

const checkAndHandleExceedMaxFractionDigits = (
  fraction: number,
  validateFraction: ValidateFractionConfig
) => {
  const { maxFractionalDigits, exceedMaxDigitsAction } = validateFraction;

  let wholeIncrement = 0;
  const fractionAsString = fraction.toString();

  if (fractionAsString.length > maxFractionalDigits) {
    fraction = +fractionAsString.slice(0, maxFractionalDigits);
    const rightDigit = +fractionAsString.slice(maxFractionalDigits, maxFractionalDigits + 1);

    if (exceedMaxDigitsAction === "round" && !isNaN(rightDigit) && rightDigit >= 5) {
      fraction++;
      /**
       * case: fraction >= 5 rounded to 10, or fraction >= 95 rounded to 100...
       */
      while (fraction % 10 === 0) {
        fraction /= 10;
      }
      if (fraction === 1) {
        fraction = 0;
        wholeIncrement++;
      }
    }
  }
  return [fraction, wholeIncrement];
};

export const limitFractionDigits = (num: number, validateFraction: ValidateFractionConfig) => {
  let [whole, fraction] = splitDecimal(num);
  let wholeIncrement = 0;

  [fraction, wholeIncrement] = checkAndHandleExceedMaxFractionDigits(fraction, validateFraction);

  return joinDecimal(whole + wholeIncrement, fraction);
};

export const validateValue = (
  num: number,
  whole: number,
  fraction: number,
  validate: ValidateConfig
) => {
  /**
   * intended behavior:
   * validate fraction => validate max, min => get whole, fraction again
   */
  let { minValue, maxValue, maxFractionalDigits, validateMode } = validate;
  let wholeIncrement = 0;
  let withDecimalSeparator = false;

  // VALIDATE FRACTION
  if (maxFractionalDigits === 0) {
    fraction = 0;
  } //
  else if (maxFractionalDigits > 0 && fraction) {
    [fraction, wholeIncrement] = checkAndHandleExceedMaxFractionDigits(fraction, validate);
  }

  num = joinDecimal(whole + wholeIncrement, fraction);
  let rightMoves = 0;

  if (validateMode === "onChangePrevent") {
    if (num > maxValue) {
      throw new Error(`Result ${num} is larger than max ${maxValue}`);
    }
    if (num < minValue) {
      throw new Error(`Result ${num} is smaller than min ${minValue}`);
    }
  } else if (validateMode === "onChangeSetBack") {
    const numDigitCount = digitCount(num);
    /**
     * withDecimalSeparator case:
     * min/max is decimal
     */

    if (num > maxValue) {
      num = maxValue;
      rightMoves = digitCount(maxValue) - numDigitCount;
      withDecimalSeparator = true;
    } //
    else if (num < minValue) {
      num = minValue;
      rightMoves = digitCount(minValue) - numDigitCount;
      withDecimalSeparator = true;
    }
    console.log(rightMoves);
  }

  /**
   * case:
   * validateMode = "onChangeSetBack" & max = 100 && input = 10,3
   * input a number to exceed max
   */
  if (fraction !== 0) {
    rightMoves++;
  }

  [whole, fraction] = splitDecimal(num);

  return {
    validatedValue: num,
    whole,
    fraction,
    rightMoves,
    withDecimalSeparator,
  };
};

export const stringToNumber = (
  strValue: string,
  format: FormatConfig,
  validate?: ValidateConfig
) => {
  const { groupingSeparator, decimalSeparator } = format;
  const parts = strValue.split(decimalSeparator);

  if (parts.length > 2) {
    throw new Error(`There're atleast 2 decimal separators [${decimalSeparator}]`);
  }

  let whole = 0;
  let fraction = 0;
  let leftMoves = 0;
  let withDecimalSeparator = false;
  const [wholePart, fractionPart] = parts;

  // HANDLE FRACTION
  fraction = (() => {
    if (parts.length === 2) {
      if (fractionPart.includes(groupingSeparator)) {
        throw new Error(
          `Fractional part [${fractionPart}] has grouping separator [${groupingSeparator}]`
        );
      }
      if (isNaN(+fractionPart)) {
        throw new Error(`Fractional part [${fractionPart}] cannot be converted to number`);
      }
      withDecimalSeparator = true;
      return +fractionPart;
    }
    return fraction;
  })();

  // HANDLE WHOLE
  whole = (() => {
    if (wholePart === "-") {
      return 0;
    }
    let result = "";

    for (const char of wholePart) {
      if (char === format.groupingSeparator) {
        leftMoves++;
      } else {
        result += char;
      }
    }
    if (isNaN(+result)) {
      throw new Error(`Cannot convert this string [${result}] to whole number`);
    }
    return +result;
  })();

  let result = joinDecimal(whole, fraction);
  let rightMoves = 0;

  if (validate) {
    ({
      validatedValue: result,
      whole,
      fraction,
      rightMoves,
    } = validateValue(result, whole, fraction, validate));
  }

  return {
    result,
    whole,
    fraction,
    withDecimalSeparator,
    leftMoves: leftMoves - rightMoves,
  };
};

export function wholeToString(whole: number, format: FormatConfig) {
  let wholeAsString = whole.toString();
  let result = "";
  let rightMoves = 0;

  for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = wholeAsString[i];

    if (leftDigit !== "-") {
      if (j && j % 3 === 0) {
        leftDigit += format.groupingSeparator;
        rightMoves++;
      }
    }
    result = leftDigit + result;
  }
  return { result, rightMoves };
}

export function numberToString(
  numValue: number,
  format: FormatConfig,
  validate?: ValidateConfig
): string {
  //
  let [whole, fraction] = splitDecimal(numValue);
  let frationPart = "";

  if (validate) {
    ({
      validatedValue: numValue,
      whole,
      fraction,
    } = validateValue(numValue, whole, fraction, validate));
  }
  if (fraction) {
    frationPart += format.decimalSeparator + fraction;
  }

  return wholeToString(whole, format).result + frationPart;
}
