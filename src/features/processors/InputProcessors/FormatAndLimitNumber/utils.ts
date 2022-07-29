import { FormatConfig, ValidateConfig } from "./types";

const roundDecimal = (n: number, maxFractionalDigits: number) => {
  const roundPow = Math.pow(10, maxFractionalDigits);
  return Math.round(n * roundPow);
};

const fractionAfterValidate = (fraction: number, validate: ValidateConfig) => {
  const { maxFractionalDigits, exceedMaxDigitsAction } = validate;
  /**
   * for case:
   * exceedMaxDigitsAction === "round"
   * fraction >= 5 rounded to 10, or fraction >= 95 rounded to 100...
   * maxFractionalDigits > 0
   */
  let wholeIncrement = 0;

  if (maxFractionalDigits === 0) {
    return [0, 0];
  } //
  else if (maxFractionalDigits > 0 && fraction) {
    const fractionAsString = fraction.toString();
    const fractionLength = fractionAsString.length;

    if (fractionLength > maxFractionalDigits) {
      fraction = +fractionAsString.slice(0, fractionLength - 1);
      const nextDigit = +fractionAsString.slice(fractionLength - 1, fractionLength);

      if (exceedMaxDigitsAction === "round" && !isNaN(nextDigit) && nextDigit >= 5) {
        fraction++;

        if (fraction % 10 === 0) {
          fraction = 0;
          wholeIncrement++;
        }
      }
    }
  }
  return [fraction, wholeIncrement];
};

export const stringToNumber = (
  strValue: string,
  format: FormatConfig,
  validate?: ValidateConfig
) => {
  const joinResult = (whole: number, fraction: number) => Number(`${whole}.${fraction}`);

  const { groupingSeparator, decimalSeparator } = format;
  const parts = strValue.split(decimalSeparator);

  if (parts.length > 2) {
    throw new Error(`There're atleast 2 decimal separators [${decimalSeparator}]`);
  }

  let whole = 0;
  let fraction = 0;
  let separatorsRemoved = 0;
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
        separatorsRemoved++;
      } else {
        result += char;
      }
    }
    if (isNaN(+result)) {
      throw new Error(`Cannot convert this string [${result}] to whole number`);
    }
    return +result;
  })();

  let result = joinResult(whole, fraction);

  /**
   * VALIDATE IF ASKED
   * intended behavior:
   * validate fraction => validate max, min => get whole, fraction again
   */
  if (validate) {
    let { minValue = -Infinity, maxValue = Infinity, validateMode } = validate;

    if (maxValue < minValue) {
      [minValue, maxValue] = [maxValue, minValue];
    }

    const [validatedFraction, wholeIncrement] = fractionAfterValidate(fraction, validate);

    result = joinResult(whole + wholeIncrement, validatedFraction);

    if (validateMode === "onChangePrevent") {
      if (result > maxValue) {
        throw new Error(`Result ${result} is larger than max ${maxValue}`);
      }
      if (result < minValue) {
        throw new Error(`Result ${result} is smaller than min ${minValue}`);
      }
    } else if (validateMode === "onChangeGoBack") {
      result = Math.min(maxValue, Math.max(minValue, result));
    }

    const [_, validatedFractionPart] = result.toString().split(".");

    whole = Math.floor(result);
    fraction = validatedFractionPart ? +validatedFractionPart : 0;
  }

  return {
    result,
    whole,
    fraction,
    withDecimalSeparator,
    separatorsRemoved,
  };
};

export function wholeToString(whole: number, format: FormatConfig) {
  let wholeAsString = whole.toString();
  let result = "";
  let separatorsAdded = 0;

  for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = wholeAsString[i];

    if (leftDigit !== "-") {
      if (j && j % 3 === 0) {
        leftDigit += format.groupingSeparator;
        separatorsAdded++;
      }
    }
    result = leftDigit + result;
  }
  return { result, separatorsAdded };
}

export function numberToString(
  numValue: number,
  format: FormatConfig
  // validate?: ValidateConfig
): string {
  const whole = Math.floor(numValue);
  let fraction: number | undefined = numValue - whole;

  let { result: strWhole } = wholeToString(whole, format);

  if (fraction) {
    // if (validate) {
    //   // const roundPow = Math.pow(10, validate.maxFractionalDigits);
    //   // fraction = Math.round(fraction * roundPow);
    //   fraction = fractionAfterValidate(fraction, validate);

    //   if (fraction === 0) {
    //     return strWhole;
    //   }
    // }
    return strWhole + format.decimalSeparator + fraction;
  }
  return strWhole;
}
