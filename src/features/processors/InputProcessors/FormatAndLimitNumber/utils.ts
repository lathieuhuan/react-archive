export const CONFIGS = {
  decimalSeparator: ",",
  groupingSeparator: ".",
};

export const stringToNumber = (strValue: string) => {
  //
  const parts = strValue.split(CONFIGS.decimalSeparator);
  let integer = 0;
  let decimal;
  let separatorsRemoved = 0;

  const stringToInteger = (strInteger: string): never | number => {
    if (strInteger === "-") {
      return 0;
    }
    
    let result = "";
    for (const char of strInteger) {
      if (char === CONFIGS.groupingSeparator) {
        separatorsRemoved++;
      } else {
        result += char;
      }
    }
    if (isNaN(+result)) {
      throw new Error("Cannot convert this string to integer");
    }
    return +result;
  };

  if (parts.length > 2) {
    throw new Error("There're atleast 2 decimal separators");
  }
  if (parts.length === 2) {
    if (parts[1].includes(".")) {
      throw new Error("Invalid decimal part");
    }
    decimal = +parts[1];
  }
  integer = stringToInteger(parts[0]);

  const result = Number(`${integer}.${decimal || 0}`);

  return {
    result,
    integer,
    decimal,
    separatorsRemoved,
  };
};

export function integerToString(integer: number) {
  let integerAsString = integer.toString();
  let result = "";
  let separatorsAdded = 0;

  for (let i = integerAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = integerAsString[i];

    if (leftDigit !== "-") {
      if (j && j % 3 === 0) {
        leftDigit += CONFIGS.groupingSeparator;
        separatorsAdded++;
      }
    }
    result = leftDigit + result;
  }
  return { result, separatorsAdded };
}

export function numberToString(numValue: number): string {
  const integer = Math.floor(numValue);
  const decimal = numValue - integer;

  let { result: strInteger } = integerToString(integer);
  if (decimal) {
    return strInteger + CONFIGS.decimalSeparator + decimal;
  }
  return strInteger;
}
