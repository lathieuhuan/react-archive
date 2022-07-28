import type { FormatConfig } from "./types";

const roundDecimal = (n: number, maxFractionalDigits: number) => {
  const roundPow = Math.pow(10, maxFractionalDigits);
  return Math.round(n * roundPow);
};

export const stringToNumber = (strValue: string, config: FormatConfig) => {
  //
  const parts = strValue.split(config.decimalSeparator);
  const [wholePart, fractionPart] = parts;

  let whole = 0;
  let fraction;
  let separatorsRemoved = 0;

  if (parts.length > 2) {
    throw new Error(`There're atleast 2 decimal separators [${config.decimalSeparator}]`);
  }
  if (parts.length === 2) {
    if (fractionPart.includes(config.groupingSeparator)) {
      throw new Error(
        `Fractional part [${fractionPart}] has grouping separator [${config.groupingSeparator}]`
      );
    }
    if (isNaN(+fractionPart)) {
      throw new Error(`Fractional part [${fractionPart}] cannot be converted to number`);
    }
    fraction = +fractionPart;
  }

  const stringToWhole = (strWhole: string): never | number => {
    if (strWhole === "-") {
      return 0;
    }

    let result = "";
    for (const char of strWhole) {
      if (char === config.groupingSeparator) {
        separatorsRemoved++;
      } else {
        result += char;
      }
    }
    if (isNaN(+result)) {
      throw new Error(`Cannot convert this string [${result}] to whole number`);
    }
    return +result;
  };
  whole = stringToWhole(wholePart);

  const result = Number(`${whole}.${fraction || 0}`);

  return {
    result,
    whole,
    fraction, // undefined when there's no fraction
    separatorsRemoved,
  };
};

export function wholeToString(whole: number, config: FormatConfig) {
  let wholeAsString = whole.toString();
  let result = "";
  let separatorsAdded = 0;

  for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = wholeAsString[i];

    if (leftDigit !== "-") {
      if (j && j % 3 === 0) {
        leftDigit += config.groupingSeparator;
        separatorsAdded++;
      }
    }
    result = leftDigit + result;
  }
  return { result, separatorsAdded };
}

export function numberToString(numValue: number, config: FormatConfig): string {
  const whole = Math.floor(numValue);
  let fraction = numValue - whole;

  let { result: strWhole } = wholeToString(whole, config);
  if (fraction) {
    const roundPow = Math.pow(10, config.maxFractionalDigits);
    fraction = Math.round(fraction * roundPow);
    return strWhole + config.decimalSeparator + fraction;
  }
  return strWhole;
}
