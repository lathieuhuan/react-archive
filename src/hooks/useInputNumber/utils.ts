import { CONFIG_DECIMAL_NUMBER } from "./constants";
import type { Config, ErrorReport, FormatConfig, InputInfo, ValidateFractionConfig } from "./types";

export const digitCount = (num: number) => num.toString().match(/[0-9]/g)?.length || 0;

export function joinDecimal(whole: number | string, fraction: number | string, isNegative?: boolean) {
  return Number((isNegative ? "-" : "") + whole + "." + fraction);
}

export function initInputInfo(strValue: string, format: FormatConfig): InputInfo {
  const parts = strValue.split(format.decimalSeparator);
  const [wholePart, fractionPart] = parts;

  if (parts.length > 2) {
    throw {
      failCase: "format/decimalSeparator",
      message: `There're atleast 2 decimal separators [${format.decimalSeparator}]`,
    };
  }

  let whole = 0;
  let isNegative = false;
  /**
   * this is one of 2 conditions for
   * target.value '${decimalSeparator}' converted to value 0 and withdecimalSeparator true
   */
  let canHaveAutoDecimal = false;
  let cursorMoves = 0;

  whole = (() => {
    const wholeSubParts = wholePart.split("-");
    let digitPart = wholeSubParts[0];

    if (wholeSubParts.length > 2) {
      throw {
        failCase: "format/minusSign",
        message: "There're atleast 2 minus signs",
      };
    }
    if (wholeSubParts.length === 2) {
      digitPart = wholeSubParts[1];
      isNegative = true;
    }
    if (digitPart === "") {
      canHaveAutoDecimal = true;
    }

    let resultAsString = "";

    for (const char of digitPart) {
      if (char === format.groupingSeparator) {
        // for every groupingSeparator removed, push cursor to the left by 1
        cursorMoves--;
      } else if (isNaN(+char)) {
        throw {
          failCase: "format/NaN",
          message: `Value [${strValue}] is not a number`,
        };
      } else {
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

        if (isNaN(+char) && char !== format.groupingSeparator) {
          throw {
            failCase: "format/NaN",
            message: `Value [${strValue}] is not a number`,
          };
        } else if (char === "0" && isTrailing) {
          trailingZeroDigits++;
        } else if (char !== format.groupingSeparator) {
          result = char + result;
          isTrailing = false;
        }
      }

      withDecimalSeparator = true;

      return result;
    }
    return fractionAsString;
  })();

  // target.value '${decimalSeparator}' converted to '0.'
  // enter 1 but add 2 characters => push cursor to the right by 1
  if (canHaveAutoDecimal && withDecimalSeparator) {
    cursorMoves++;
  }

  return {
    value: joinDecimal(whole, fractionAsString, isNegative),
    trailingZeroDigits,
    withDecimalSeparator,
    isNegative,
    cursorMoves,
  };
}

export function validateInputInfo(inputInfo: InputInfo, { format, validate, onValidateFailed }: Config) {
  const { value } = inputInfo;
  const { decimalSeparator = CONFIG_DECIMAL_NUMBER.decimalSeparator } = format || {};
  const { minValue, maxValue, maxFractionDigits, validateMode } = validate;

  // VALIDATE FRACTION
  if (maxFractionDigits === 0) {
    inputInfo.value = Math.trunc(value);
    inputInfo.withDecimalSeparator = false;
  } else {
    let tempInputValue = value.toString();

    // add trailing zeroes
    if (value === Math.floor(value)) {
      tempInputValue += decimalSeparator;
    }
    tempInputValue += "0".repeat(inputInfo.trailingZeroDigits);

    const limitedResult = limitFractionDigits(tempInputValue, {
      ...validate,
      onValidateFailed,
    });

    inputInfo.value = limitedResult.newValue;
    inputInfo.trailingZeroDigits = limitedResult.newTrailingZeroDigits;
  }

  // VALIDATE MAX, MIN
  const MAX_VALUE_ERROR: ErrorReport = {
    failCase: "maxValue",
    message: `Value must be equal or less than ${maxValue}`,
  };
  const MIN_VALUE_ERROR: ErrorReport = {
    failCase: "minValue",
    message: `Value must be equal or more than ${minValue}`,
  };

  if (validateMode === "onChangePrevent") {
    if (value > maxValue) {
      throw MAX_VALUE_ERROR;
    }
    if (value < minValue) {
      throw MIN_VALUE_ERROR;
    }
  } else if (validateMode === "onChangeSetBack") {
    let limit: number | undefined;
    let error: ErrorReport | undefined;

    if (value > maxValue) {
      limit = maxValue;
      error = MAX_VALUE_ERROR;
    }
    if (value < minValue) {
      limit = minValue;
      error = MIN_VALUE_ERROR;
    }

    if (limit !== undefined) {
      inputInfo.cursorMoves += digitCount(limit) - digitCount(value);
      inputInfo.value = limit;

      if (error && typeof onValidateFailed === "function") {
        onValidateFailed(error);
      }
    }
  }
}

/**
 *
 * @param value when as string can contain trailing zeroes 3.00
 * @returns value & trailingZeroDigits
 */
export function limitFractionDigits(
  value: string | number,
  {
    maxFractionDigits = 3,
    exceedMaxFractionDigitsAction = "round",
    onValidateFailed,
  }: Partial<ValidateFractionConfig> = {}
) {
  let newValue = +value;
  let newTrailingZeroDigits = 0;

  const splitResult = value.toString().split(".");
  const whole = splitResult[0];
  const fractionPart = splitResult[1] ? splitResult[1].slice(0, maxFractionDigits) : "";

  for (let i = fractionPart.length - 1; i >= 0; i--) {
    if (fractionPart[i] === "0") {
      newTrailingZeroDigits++;
    } else {
      break;
    }
  }

  if (exceedMaxFractionDigitsAction === "prevent") {
    newValue = joinDecimal(whole, fractionPart);
  } else if (exceedMaxFractionDigitsAction === "round") {
    const roundPow = Math.pow(10, maxFractionDigits);

    newValue = Math.round(newValue * roundPow) / roundPow;

    if (newTrailingZeroDigits) {
      const freeSlots = maxFractionDigits - digitCount(+newValue.toString().split(".")[1]);
      newTrailingZeroDigits = Math.min(freeSlots, newTrailingZeroDigits);
    }
  }

  if (digitCount(newValue) !== digitCount(+value) && typeof onValidateFailed === "function") {
    onValidateFailed({
      failCase: "format/maxFractionDigits",
      message: `The maximum number of fraction digits is ${maxFractionDigits}`,
    });
  }

  return {
    newValue,
    newTrailingZeroDigits,
  };
}

export function convertToInputValue(
  inputInfo: Partial<InputInfo> & { value: number },
  format: FormatConfig,
  /**
   * Only need when there are inputInfo.trailingZeroDigits
   */
  maxFractionDigits?: number
) {
  const { value, isNegative, withDecimalSeparator, trailingZeroDigits } = inputInfo;

  const splitResult = value.toString().split(".");
  let wholeAsString = splitResult[0];
  const fractionAsString = splitResult[1];

  let resultAsString = "";
  let cursorMoves = 0;

  if (isNegative && value !== 0) {
    // wholeAsString is '-x', x !== 0
    // minus will be added again later
    wholeAsString = wholeAsString.slice(1);
  }

  for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = wholeAsString[i];

    if (j && j % 3 === 0) {
      leftDigit += format.groupingSeparator;
      // for every groupingSeparator added, push cursor to the right by 1
      cursorMoves++;
    }
    resultAsString = leftDigit + resultAsString;
  }

  if (inputInfo.cursorMoves !== undefined) {
    inputInfo.cursorMoves += cursorMoves;
  }
  if (isNegative) {
    resultAsString = "-" + resultAsString;
  }
  if (fractionAsString) {
    resultAsString += format.decimalSeparator + fractionAsString;
  } else if (withDecimalSeparator) {
    resultAsString += format.decimalSeparator;
  }
  if (maxFractionDigits && trailingZeroDigits) {
    const freeSlots = maxFractionDigits - (fractionAsString?.length || 0);

    resultAsString += "0".repeat(Math.min(trailingZeroDigits, freeSlots));
  }

  return resultAsString;
}

export function mergeRefs(...refs: any[]) {
  const filteredRefs = refs.filter(Boolean);

  if (!filteredRefs.length) {
    return null;
  }

  return (instance: Element | null) => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    }
  };
}
