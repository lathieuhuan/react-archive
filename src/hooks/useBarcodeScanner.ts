import { useEffect, useRef, useState } from "react";

interface IUseBarcodeScannerArgs {
  disabled?: boolean;
  /**
   * Scan result will be validated and split with this format.
   * E.g. formatConfig [2, 2] --> result must be of length 4 ('1234') and formatted into ['12', '34']
   *
   */
  formatConfig?: number[];
  /**
   * If false, formattedBarcode will be return to [] with useEffect
   */
  keepPreviousResult?: boolean;
  /**
   * Fired on scanning process ends and the result meets requirements
   */
  onScanSuccess?: (barcode: string[]) => void;
}

export function useBarcodeScanner(args?: IUseBarcodeScannerArgs) {
  const { disabled = false, formatConfig = [2, 5, 5, 1], keepPreviousResult = false, onScanSuccess } = args || {};

  const [barcode, setBarcode] = useState<string[]>([]);

  useEffect(() => {
    let concatedKey = "";
    let previousKeydownTime = Date.now();

    const onKeydown = (e: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      if (e.key === "Enter") {
        // validate & split scanned series
        const requiredLength = formatConfig.reduce((accumulator, numOfDigits) => accumulator + (numOfDigits ?? 0), 0);

        if (concatedKey.length === requiredLength) {
          const newBarcode: string[] = [];
          let startIndex = 0;

          for (let i = 0; i < formatConfig.length; i++) {
            const numOfDigits = formatConfig[i];

            if (typeof numOfDigits === "number") {
              newBarcode.push(concatedKey.slice(startIndex, startIndex + numOfDigits));
              startIndex += numOfDigits;
            }
          }

          onScanSuccess && onScanSuccess(newBarcode);

          setBarcode(newBarcode);
        }

        // Reset series
        return (concatedKey = "");
      }

      // some scanner add Shift to key (?)
      const key = e.key.replace("Shift", "");

      if (key.length > 1 || /[^A-Za-z0-9]/g.test(key)) {
        return;
      }

      const currentKeydownTime = Date.now();
      const timeElapsed = currentKeydownTime - previousKeydownTime;

      // scanner's input is very quick < 40ms
      if (timeElapsed < 100) {
        concatedKey += key;
      } else {
        // start scanning
        concatedKey = key;
      }

      previousKeydownTime = currentKeydownTime;
    };

    window.addEventListener("keydown", onKeydown);

    return () => window.removeEventListener("keydown", onKeydown);
  }, [disabled]);

  useEffect(() => {
    if (!keepPreviousResult && barcode.length) {
      setBarcode([]);
    }
  }, [JSON.stringify(barcode)]);

  return {
    formattedBarcode: barcode,
  };
}
