export const CONFIGS = {
  decimalSeparator: ",",
  groupingSeparator: ".",
};

type Splitter = (strValue: string) => never | [number, number, number | undefined];

export const stringToNumber: Splitter = (strValue) => {
  //
  const stringToInteger = (strInteger: string): never | number => {
    let result = +strInteger.replaceAll(CONFIGS.groupingSeparator, "");

    if (isNaN(result)) {
      throw new Error("Cannot convert this string to integer");
    }
    return result;
  };

  const parts = strValue.split(CONFIGS.decimalSeparator);

  if (parts.length > 2) {
    throw new Error("There're atleast 2 decimal separators");
  }

  let integer = 0;
  let decimal;

  if (parts.length === 1) {
    integer = stringToInteger(strValue);
  } else if (parts.length === 2) {
    if (parts[1].includes(".")) {
      throw new Error("Invalid decimal part");
    }
    integer = stringToInteger(parts[0]);
    decimal = +parts[1];
  }
  const result = Number(`${integer}.${decimal || 0}`);

  return [result, integer, decimal];
};

//
export function integerToString(integer: number): string {
  let integerAsString = integer.toString();
  let strInteger = "";
  for (let i = integerAsString.length - 1, j = 0; i >= 0; i--, j++) {
    let leftDigit = integerAsString[i];
    if (j && j % 3 === 0) {
      leftDigit += CONFIGS.groupingSeparator;
    }
    strInteger = leftDigit + strInteger;
  }
  return strInteger;
}

//
export function numberToString(numValue: number): string {
  const integer = Math.floor(numValue);
  const decimal = numValue - integer;

  let strInteger = integerToString(integer);
  if (decimal) {
    return strInteger + CONFIGS.decimalSeparator + decimal;
  }
  return strInteger;
}
