import type { FormatConfig, InputInfo, ValidateConfig, ValidateFractionConfig } from "./types";

// export const checkWithDecimal = (string: string, decimalSeparator: string) => {
//   const separatorIndex = string.indexOf(decimalSeparator);
//   return separatorIndex !== -1 && string.slice(separatorIndex, separatorIndex + 2).length >= 2;
// };

export const digitCount = (num: number) => num.toString().match(/[0-9]/g)?.length || 0;

export const joinDecimal = (whole: number, fraction: number, isNegative: boolean) => {
  return Number(`${whole}.${fraction}`) * (isNegative ? -1 : 1);
};

export const splitDecimal = (num: number) => {
  const [_, fractionPart] = num.toString().split(".");
  const whole = Math.abs(Math.trunc(num));

  return [whole, fractionPart ? +fractionPart : 0];
};

export function wholeToString(inputInfo: InputInfo, format: FormatConfig) {
  let wholeAsString = inputInfo.whole.toString();
  let result = "";

  for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = wholeAsString[i];

    if (leftDigit !== "-") {
      if (j && j % 3 === 0) {
        leftDigit += format.groupingSeparator;
        inputInfo.cursorMoves++;
      }
    }
    result = leftDigit + result;
  }

  return result;
}

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

  return joinDecimal(whole + wholeIncrement, fraction, num < 0);
};

export const initInputInfo = (strValue: string, format: FormatConfig): InputInfo => {
  const { groupingSeparator, decimalSeparator } = format;
  const parts = strValue.split(decimalSeparator);

  if (parts.length > 2) {
    throw new Error(`There're atleast 2 decimal separators [${decimalSeparator}]`);
  }

  let whole = 0;
  let fraction = 0;
  let isNegative = false;
  let withDecimalSeparator = false;
  let cursorMoves = 0;
  const [wholePart, fractionPart] = parts;

  // HANDLE WHOLE
  whole = (() => {
    const wholeSubParts = wholePart.split("-");
    let digitPart = wholeSubParts[0];

    if (wholeSubParts.length > 2) {
      throw new Error(`There're atleast 2 minus signs`);
    }
    if (wholeSubParts.length === 2) {
      digitPart = wholeSubParts[1];
      isNegative = true;
    }

    let result = "";

    for (const char of digitPart) {
      if (char === format.groupingSeparator) {
        cursorMoves--;
      } else {
        result += char;
      }
    }

    if (isNaN(+result)) {
      throw new Error(`Cannot convert this string [${result}] to whole number`);
    }
    return +result;
  })();

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

  return {
    whole,
    fraction,
    isNegative,
    withDecimalSeparator,
    cursorMoves,
  };
};

export const validateInputInfo = (inputInfo: InputInfo, validate: ValidateConfig) => {
  /**
   * intended behavior:
   * validate fraction => validate max, min => get whole, fraction again
   */
  let { minValue, maxValue, maxFractionalDigits, validateMode } = validate;

  // VALIDATE FRACTION
  if (maxFractionalDigits === 0) {
    inputInfo.fraction = 0;
  } //
  else if (maxFractionalDigits > 0 && inputInfo.fraction) {
    const [validatedFraction, wholeIncrement] = checkAndHandleExceedMaxFractionDigits(
      inputInfo.fraction,
      validate
    );
    inputInfo.whole += wholeIncrement;
    inputInfo.fraction = validatedFraction;
  }

  let value = joinDecimal(inputInfo.whole, inputInfo.fraction, inputInfo.isNegative);

  if (validateMode === "onChangePrevent") {
    if (value > maxValue) {
      throw new Error(`Result ${value} is larger than max ${maxValue}`);
    }
    if (value < minValue) {
      throw new Error(`Result ${value} is smaller than min ${minValue}`);
    }
  } else if (validateMode === "onChangeSetBack") {
    const numDigitCount = digitCount(value);
    /**
     * withDecimalSeparator case:
     * min/max is decimal
     */

    if (value > maxValue) {
      value = maxValue;
      inputInfo.withDecimalSeparator = splitDecimal(maxValue)[1] !== 0;

      if (!inputInfo.withDecimalSeparator) {
        inputInfo.cursorMoves += digitCount(maxValue) - numDigitCount;
      }
    } //
    else if (value < minValue) {
      value = minValue;
      inputInfo.withDecimalSeparator = splitDecimal(minValue)[1] !== 0;

      if (!inputInfo.withDecimalSeparator) {
        inputInfo.cursorMoves += digitCount(minValue) - numDigitCount;
      }
    }
  }

  [inputInfo.whole, inputInfo.fraction] = splitDecimal(value);
};
