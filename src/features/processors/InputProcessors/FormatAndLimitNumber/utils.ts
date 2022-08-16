import type { FormatConfig, InputInfo, ValidateConfig, ValidateFractionConfig } from "./types";

export const digitCount = (num: number) => num.toString().match(/[0-9]/g)?.length || 0;

export const joinDecimal = (
  whole: number | string,
  fraction: number | string,
  isNegative?: boolean
) => {
  return Number((isNegative ? "-" : "") + whole + "." + fraction);
};

export const initInputInfo = (strValue: string, format: FormatConfig): InputInfo => {
  const parts = strValue.split(format.decimalSeparator);
  const [wholePart, fractionPart] = parts;

  if (parts.length > 2) {
    throw new Error(`There're atleast 2 decimal separators [${format.decimalSeparator}]`);
  }

  let whole = 0;
  let isNegative = false;
  let cursorMoves = 0;

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

    let resultAsString = "";

    for (const char of digitPart) {
      if (char === format.groupingSeparator) {
        cursorMoves--;
      } //
      else if (isNaN(+char)) {
        throw new Error(`Invalid wholePart [${digitPart}]`);
      } //
      else {
        resultAsString += char;
      }
    }

    return +resultAsString;
  })();

  let fractionAsString = "";
  let withDecimalSeparator = false;
  let trailingZeroDigits = 0;

  fractionAsString = (() => {
    if (parts.length === 2) {
      let result = "";
      let isTrailing = true;

      for (let i = fractionPart.length - 1; i >= 0; i--) {
        const char = fractionPart[i];

        if (isNaN(+char)) {
          throw new Error(`Invalid fractionPart [${fractionPart}]`);
        } //
        else if (char === "0" && isTrailing) {
          trailingZeroDigits++;
        } //
        else {
          result = char + result;
          isTrailing = false;
        }
      }

      withDecimalSeparator = true;

      return result;
    }
    return fractionAsString;
  })();

  return {
    value: joinDecimal(whole, fractionAsString, isNegative),
    trailingZeroDigits,
    withDecimalSeparator,
    cursorMoves,
  };
};

/**
 * validate fraction => validate max, min
 */
export const validateInputInfo = (inputInfo: InputInfo, validate: ValidateConfig) => {
  let { minValue, maxValue, maxFractionalDigits, validateMode } = validate;

  // VALIDATE FRACTION
  if (maxFractionalDigits === 0) {
    inputInfo.value = Math.trunc(inputInfo.value);
    inputInfo.withDecimalSeparator = false;
  } //
  else {
    let tempInputValue: string;

    if (inputInfo.value > Math.floor(inputInfo.value)) {
      tempInputValue = inputInfo.value + "0".repeat(inputInfo.trailingZeroDigits);
    } //
    else {
      tempInputValue = inputInfo.value.toString() + "." + "0".repeat(inputInfo.trailingZeroDigits);
    }
    [inputInfo.value, inputInfo.trailingZeroDigits] = limitFractionDigits(tempInputValue, validate);
  }

  if (validateMode === "onChangePrevent") {
    if (inputInfo.value > maxValue) {
      throw new Error(`Result ${inputInfo.value} is larger than max ${maxValue}`);
    }
    if (inputInfo.value < minValue) {
      throw new Error(`Result ${inputInfo.value} is smaller than min ${minValue}`);
    }
  } else if (validateMode === "onChangeSetBack") {
    const limit =
      inputInfo.value > maxValue ? maxValue : inputInfo.value < minValue ? minValue : null;

    if (limit) {
      inputInfo.cursorMoves += digitCount(maxValue) - digitCount(inputInfo.value);
      inputInfo.value = maxValue;
    }
  }
};

/**
 *
 * @param value as string can contains trailing zeroes
 * @returns value & trailingZeroDigits
 */
export const limitFractionDigits = (
  value: string | number,
  { maxFractionalDigits, exceedMaxDigitsAction }: ValidateFractionConfig
) => {
  let returnValue = +value;
  let trailingZeroDigits = 0;

  if (exceedMaxDigitsAction === "prevent") {
    let [whole, fractionPart] = value.toString().split(".");

    fractionPart = fractionPart ? fractionPart.slice(0, maxFractionalDigits) : "";

    for (let i = fractionPart.length - 1; i >= 0; i--) {
      if (fractionPart[i] === "0") {
        trailingZeroDigits++;
      } //
      else break;
    }

    returnValue = joinDecimal(whole, fractionPart);
  } //
  else if (exceedMaxDigitsAction === "round") {
    const roundPow = Math.pow(10, maxFractionalDigits);
    returnValue = Math.round(returnValue * roundPow) / roundPow;
  }

  return [returnValue, trailingZeroDigits];
};

export function convertToInputValue(
  inputInfo: InputInfo,
  format: FormatConfig,
  validate: ValidateConfig
) {
  //
  let [wholeAsString, fractionAsString] = inputInfo.value.toString().split(".");
  let resultAsString = "";
  let isNegative = wholeAsString[0] === "-";

  if (isNegative) {
    wholeAsString = wholeAsString.slice(1);
  }

  // for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
  //   let leftDigit = wholeAsString[i];

  //   if (j && j % 3 === 0) {
  //     leftDigit += format.groupingSeparator;
  //     inputInfo.cursorMoves++;
  //   }
  //   resultAsString = leftDigit + resultAsString;
  // }

  // if (isNegative) {
  //   resultAsString = "-" + resultAsString;
  // }

  // if (fractionAsString) {
  //   resultAsString += format.decimalSeparator + fractionAsString;
  // } //
  // else if (inputInfo.withDecimalSeparator) {
  //   resultAsString += format.decimalSeparator;
  // }

  const digits = inputInfo.value.toString().match(/[0-9]/g);

  const numOfDigits = digits?.length || 0;

  inputInfo.cursorMoves += Math.floor((numOfDigits + 1) / 3);

  resultAsString = new Intl.NumberFormat("vi-VN").format(inputInfo.value);

  if (inputInfo.trailingZeroDigits) {
    const freeSlots = validate.maxFractionalDigits - (fractionAsString?.length || 0);

    resultAsString += "0".repeat(Math.min(inputInfo.trailingZeroDigits, freeSlots));
  }

  return resultAsString;
}
