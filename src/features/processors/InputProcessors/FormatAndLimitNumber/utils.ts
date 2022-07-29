import type { FormatConfig, Fraction } from "./types";

const roundDecimal = (n: number, maxFractionalDigits: number) => {
  const roundPow = Math.pow(10, maxFractionalDigits);
  return Math.round(n * roundPow);
};

export const stringToNumber = (strValue: string, format: FormatConfig) => {
  const { groupingSeparator, decimalSeparator, maxFractionalDigits } = format;
  //
  const parts = strValue.split(decimalSeparator);
  const [wholePart, fractionPart] = parts;

  let whole = 0;
  let fraction: Fraction;
  let separatorsRemoved = 0;

  if (parts.length > 2) {
    throw new Error(`There're atleast 2 decimal separators [${decimalSeparator}]`);
  }
  if (parts.length === 2) {
    if (fractionPart.includes(groupingSeparator)) {
      throw new Error(
        `Fractional part [${fractionPart}] has grouping separator [${groupingSeparator}]`
      );
    }

    if (isNaN(+fractionPart)) {
      throw new Error(`Fractional part [${fractionPart}] cannot be converted to number`);
    }
    fraction = +fractionPart;
  }

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

  if (maxFractionalDigits === 0) {
    fraction = undefined;
  } //
  else if (maxFractionalDigits > 0 && fraction) {
    const fractionAsString = fraction.toString();
    const fractionLength = fractionAsString.length;

    if (fractionLength > maxFractionalDigits) {
      fraction = +fractionAsString.slice(0, fractionLength - 1);
      const nextDigit = +fractionAsString.slice(fractionLength - 1, fractionLength);

      if (format.exceedMaxDigitsAction === "round" && !isNaN(nextDigit) && nextDigit >= 5) {
        fraction++;
      }
    }
  }

  const result = Number(`${whole}.${fraction || 0}`);

  return {
    result,
    whole,
    fraction, // undefined when there's no fraction
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

export function numberToString(numValue: number, format: FormatConfig): string {
  const whole = Math.floor(numValue);
  let fraction = numValue - whole;

  let { result: strWhole } = wholeToString(whole, format);
  if (fraction) {
    const roundPow = Math.pow(10, format.maxFractionalDigits);
    fraction = Math.round(fraction * roundPow);

    if (fraction === 0) {
      return strWhole;
    }
    return strWhole + format.decimalSeparator + fraction;
  }
  return strWhole;
}
