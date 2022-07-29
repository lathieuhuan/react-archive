import { FormatConfig, ValidateConfig } from "./types";

const joinDecimal = (whole: number, fraction: number) => Number(`${whole}.${fraction}`);

const splitDecimal = (num: number) => {
  const [_, fractionPart] = num.toString().split(".");
  return [Math.floor(num), fractionPart ? +fractionPart : 0];
};

export const limitFractionDigits = (num: number, limit: number) => {
  let [whole, fraction] = splitDecimal(num);
  const fractionAsString = fraction.toString();

  if (fraction && fractionAsString.length > limit) {
    fraction = +fractionAsString.slice(0, limit);
  }

  return joinDecimal(whole, fraction);
};

const validateValue = (num: number, whole: number, fraction: number, validate: ValidateConfig) => {
  /**
   * intended behavior:
   * validate fraction => validate max, min => get whole, fraction again
   */
  let { minValue, maxValue, maxFractionalDigits, exceedMaxDigitsAction, validateMode } = validate;

  /**
   * for case:
   * exceedMaxDigitsAction = "round"
   * & fraction >= 5 rounded to 10, or fraction >= 95 rounded to 100...
   * & maxFractionalDigits > 0
   */
  let wholeIncrement = 0;

  // VALIDATE FRACTION
  if (maxFractionalDigits === 0) {
    fraction = 0;
  } //
  else if (maxFractionalDigits > 0 && fraction) {
    const fractionAsString = fraction.toString();
    const fractionLength = fractionAsString.length;

    if (fractionLength > maxFractionalDigits) {
      fraction = +fractionAsString.slice(0, maxFractionalDigits);
      const nextDigit = +fractionAsString.slice(maxFractionalDigits, maxFractionalDigits + 1);

      if (exceedMaxDigitsAction === "round" && !isNaN(nextDigit) && nextDigit >= 5) {
        fraction++;

        while (fraction % 10 === 0) {
          fraction /= 10;
        }
        if (fraction === 1) {
          fraction = 0;
          wholeIncrement++;
        }
      }
    }
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
    const numDigits = num.toString().length;

    if (num > maxValue) {
      rightMoves = maxValue.toString().length - numDigits;
      num = maxValue;
    } //
    else if (num < minValue) {
      rightMoves = minValue.toString().length - numDigits;
      num = minValue;
    }
  }

  /**
   * for case
   * validateMode = "onChangeSetBack" & max = 100 && input = 10,3
   * input a number to exceed max
   */
  if (fraction !== 0) {
    rightMoves++;
  }

  return [num, rightMoves];
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
    [result, rightMoves] = validateValue(result, whole, fraction, validate);
    [whole, fraction] = splitDecimal(result);
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
    [numValue] = validateValue(numValue, whole, fraction, validate);
    [whole, fraction] = splitDecimal(numValue);
  }
  if (fraction) {
    frationPart += format.decimalSeparator + fraction;
  }

  return wholeToString(whole, format).result + frationPart;
}
