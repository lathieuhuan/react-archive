import { CONFIG_DECIMAL_NUMBER, DEFAULT_VALIDATE, MAXIMUM } from "./constants";
import type {
  Config,
  ErrorReport,
  FormatConfig,
  InputInfo,
  OnValidateFailedHandler,
  ValidateConfig,
  ValidateFractionConfig,
} from "./types";

export const digitCount = (num: number) => num.toString().match(/[0-9]/g)?.length || 0;

export function joinDecimal(whole: number | string, fraction: number | string, isNegative?: boolean) {
  return Number((isNegative ? "-" : "") + whole + "." + fraction);
}

export function initInputInfo(strValue: string, format: FormatConfig): InputInfo {
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
      throw new Error("There're atleast 2 minus signs");
    }
    if (wholeSubParts.length === 2) {
      digitPart = wholeSubParts[1];
      isNegative = true;
    }

    let resultAsString = "";

    for (const char of digitPart) {
      if (char === format.groupingSeparator) {
        cursorMoves--;
      } else if (isNaN(+char)) {
        throw new Error(`Invalid wholePart [${digitPart}]`);
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

        if (isNaN(+char)) {
          throw new Error(`Invalid fractionPart [${fractionPart}]`);
        } else if (char === "0" && isTrailing) {
          trailingZeroDigits++;
        } else {
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
}

export function validateInputInfo(inputInfo: InputInfo, { format, validate, onValidateFailed }: Config) {
  const { decimalSeparator = CONFIG_DECIMAL_NUMBER.decimalSeparator } = format || {};
  const { minValue, maxValue, maxFractionDigits, validateMode } = validate;

  // VALIDATE FRACTION
  if (maxFractionDigits === 0) {
    inputInfo.value = Math.trunc(inputInfo.value);
    inputInfo.withDecimalSeparator = false;
  } else {
    let tempInputValue = inputInfo.value.toString();

    // add trailing zeroes
    if (inputInfo.value === Math.floor(inputInfo.value)) {
      tempInputValue += decimalSeparator;
    }
    tempInputValue += "0".repeat(inputInfo.trailingZeroDigits);

    const limitedResult = limitFractionDigits(tempInputValue, validate);

    inputInfo.value = limitedResult.newValue;
    inputInfo.trailingZeroDigits = limitedResult.newTrailingZeroDigits;
  }

  // VALIDATE MAX, MIN
  const MAX_VALUE_ERROR: ErrorReport = {
    failCase: "maxValue",
    records: [maxValue.toString().replace(".", decimalSeparator)],
    message: `Result ${inputInfo.value} is larger than max ${maxValue}`,
  };
  const MIN_VALUE_ERROR: ErrorReport = {
    failCase: "minValue",
    records: [minValue.toString().replace(".", decimalSeparator)],
    message: `Result ${inputInfo.value} is smaller than min ${minValue}`,
  };

  if (validateMode === "onChangePrevent") {
    if (inputInfo.value > maxValue) {
      throw MAX_VALUE_ERROR;
    }
    if (inputInfo.value < minValue) {
      throw MIN_VALUE_ERROR;
    }
  } else if (validateMode === "onChangeSetBack") {
    let limit: number | undefined;
    let error: ErrorReport | undefined;

    if (inputInfo.value > maxValue) {
      limit = maxValue;
      error = MAX_VALUE_ERROR;
    }
    if (inputInfo.value < minValue) {
      limit = minValue;
      error = MIN_VALUE_ERROR;
    }

    if (limit !== undefined) {
      inputInfo.cursorMoves += digitCount(limit) - digitCount(inputInfo.value);
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
  { maxFractionDigits = 3, exceedMaxFractionDigitsAction = "round" }: Partial<ValidateFractionConfig> = {}
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
  const splitResult = inputInfo.value.toString().split(".");
  let wholeAsString = splitResult[0];
  const fractionAsString = splitResult[1];

  let resultAsString = "";
  let cursorMoves = 0;
  const isNegative = wholeAsString[0] === "-";

  if (isNegative) {
    wholeAsString = wholeAsString.slice(1);
  }

  for (let i = wholeAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = wholeAsString[i];

    if (j && j % 3 === 0) {
      leftDigit += format.groupingSeparator;
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
  } else if (inputInfo.withDecimalSeparator) {
    resultAsString += format.decimalSeparator;
  }
  if (maxFractionDigits && inputInfo.trailingZeroDigits) {
    const freeSlots = maxFractionDigits - (fractionAsString?.length || 0);

    resultAsString += "0".repeat(Math.min(inputInfo.trailingZeroDigits, freeSlots));
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
