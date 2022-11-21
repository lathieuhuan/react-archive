import { useEffect, useState } from "react";

import { useBarcodeScanner, useDebounce } from "@Src/hooks";
import { callFakeApi } from "@Utils/index";

import InputBox from "@Components/InputBox";
import JsonDisplayer from "@Components/JsonDisplayer";

interface IInputState {
  value: string;
  src: "INPUT" | "SCAN";
}

export default function BarcodeScanner() {
  const [input, setInput] = useState<IInputState>({
    value: "",
    src: "INPUT",
  });

  const { formattedBarcode } = useBarcodeScanner({
    keepPreviousResult: true,
  });

  const debouncedValue = useDebounce(input.value, 300);

  useEffect(() => {
    if (input.src === "INPUT" && debouncedValue) {
      handleBusiness("input: " + debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (formattedBarcode.length) {
      handleBusiness("scan: " + formattedBarcode.join(""));

      setInput({
        value: formattedBarcode.join(""),
        src: "SCAN",
      });
    }
  }, [JSON.stringify(formattedBarcode)]);

  function handleBusiness(term: string) {
    console.log("callApi with this term", term);

    callFakeApi().then((args) => {
      console.log("response", args);
    });
  }

  return (
    <div className="w-full">
      <InputBox
        value={input.value}
        onChange={(e) =>
          setInput({
            value: e.target.value,
            src: "INPUT",
          })
        }
      />
      <JsonDisplayer className="my-4" title="Barcode" body={formattedBarcode} />
    </div>
  );
}
