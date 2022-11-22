import { useEffect, useState } from "react";

import { useBarcodeScanner, useDebounce, useFakeApi, useLogger } from "@Src/hooks";

import InputBox from "@Components/InputBox";
import Button from "@Components/Button";
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

  const { isLoading, callFakeApi } = useFakeApi();

  useBarcodeScanner({
    keepPreviousResult: true,
    onScanSuccess,
  });

  const debouncedValue = useDebounce(input.value, 300);

  const { log, renderLogger } = useLogger({ title: "ACTIONS" });

  useEffect(() => {
    log(`useEffect run. Debounced value: ${JSON.stringify(debouncedValue)} (src: ${input.src})`);

    if (input.src === "INPUT" && debouncedValue) {
      handleBusiness(debouncedValue + " (INPUT)");
    }
    if (input.src === "SCAN") {
      setInput({
        value: input.value,
        src: "INPUT",
      });
    }
  }, [debouncedValue]);

  function handleBusiness(term: string) {
    log(`call api with this term: ${term}`);

    callFakeApi().then((args) => {
      log(["response:", args as string]);
    });
  }

  function onScanSuccess(barcode: string[]) {
    const newBarcode = barcode.join("");

    handleBusiness(newBarcode + " (SCAN)");

    setInput({
      value: newBarcode,
      src: "SCAN",
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-x-4">
        <InputBox
          value={input.value}
          onChange={(e) => {
            setInput({
              value: e.target.value,
              src: "INPUT",
            });
          }}
        />
        <Button onClick={() => console.log(input)}>See Input state</Button>
        <span hidden={!isLoading}>Loading...</span>
      </div>

      <JsonDisplayer title="Input state" body={input} />

      {renderLogger()}
    </div>
  );
}
