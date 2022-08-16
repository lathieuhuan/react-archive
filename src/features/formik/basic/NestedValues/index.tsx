import Button from "@Src/components/Button";
import InputBox from "@Src/components/InputBox";
import JsonDisplayer from "@Src/components/JsonDisplayer";
import { useState } from "react";
import Core from "./Core";
import { Payment } from "./types";

export default function NestedValues() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [amountToPay, setAmountToPay] = useState(200000);

  const onClickReset = () => {
    setPayments([]);
    setIsActive(false);
    setAmountToPay(200000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <p className="text-lg font-medium">Multi-payments</p>
        <Button className="px-2 py-1 text-sm" onClick={() => setIsActive(true)}>
          Open Modal
        </Button>
        <Button
          className="px-2 py-1 text-sm bg-yellow-500 hover:bg-yellow-400 hover:text-black"
          onClick={onClickReset}
        >
          Reset
        </Button>
      </div>

      <InputBox value={amountToPay} onChange={(e) => setAmountToPay(+e.target.value)} />

      <div>
        {isActive ? (
          <Core
            amountToPay={amountToPay}
            payments={payments}
            onConfirmPayments={setPayments}
            onClose={() => setIsActive(false)}
          />
        ) : (
          <p className=" text-red-500">Modal has been unmounted</p>
        )}
      </div>

      <JsonDisplayer title="Payments" body={payments} />
    </div>
  );
}
