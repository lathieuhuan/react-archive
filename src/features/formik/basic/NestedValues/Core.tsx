import cn from "classnames";
import { useState } from "react";
import { Payment, PaymentMethod } from "./types";
import InputBox from "@Src/components/InputBox";
import { PAYMENT_METHODS } from "./constants";
import Button from "@Src/components/Button";

interface CoreProps {
  amountToPay: number;
  payments: Payment[];
  onConfirmPayments: (payments: Payment[]) => void;
  onClose: () => void;
}
export default function Core(props: CoreProps) {
  const { amountToPay, onConfirmPayments, onClose } = props;

  const [payments, setPayments] = useState(props.payments);
  const [error, setError] = useState("");

  const totalPaymentAmount = payments.reduce((result, payment) => result + payment.amount, 0);

  const calculateA = (payments: Payment[]) => {
    return payments.reduce(
      (totalNotCash, payments) => totalNotCash + (payments.method === "CASH" ? 0 : payments.amount),
      0
    );
  };

  // const B = amountToPay - A;
  const C = amountToPay - totalPaymentAmount;

  const removePaymentByIndex = (index: number) => {
    setPayments((prev) => {
      const newPayments = [...prev];
      newPayments.splice(index, 1);
      return newPayments;
    });
  };

  const onClickRemovePayment = (method: PaymentMethod) => {
    const indexFound = payments.findIndex((payment) => payment.method === method);
    if (indexFound !== -1) {
      removePaymentByIndex(indexFound);
    }
  };

  const onClickPaymentMethod = (method: PaymentMethod) => {
    const indexFound = payments.findIndex((payment) => payment.method === method);

    if (indexFound === -1) {
      setPayments((prev) => {
        const newPayment = {
          method,
          amount: 0,
          refInfo: "",
        };
        return [...prev, newPayment];
      });
    } else {
      removePaymentByIndex(indexFound);
    }
  };

  const onChangePaymentAmount = ({ method }: Payment, newAmount: number) => {
    const newPayments = [...payments];
    const paymentFound = newPayments.find((payment) => payment.method === method);

    if (paymentFound) {
      paymentFound.amount = newAmount;
      const A = calculateA(newPayments);

      if (A < amountToPay) {
        setError(`Vui long nhap toi da ${amountToPay - A}`);
      }

      setPayments(newPayments);
    }
  };

  const onClickConfifm = () => {
    const A = calculateA(payments);

    if (A < amountToPay) {
      setError(`Vui long nhap toi da ${amountToPay - A}`);
      return;
    }

    if (amountToPay > totalPaymentAmount) {
      setError("Some error");
    } else {
      onConfirmPayments(payments.filter((payment) => payment.amount));
      onClose();
    }
  };

  return (
    <div className="p-4 border border-slate-300 rounded-lg">
      <div className="flex gap-2">
        {PAYMENT_METHODS.map((method, i) => {
          return (
            <button
              key={i}
              className={cn(
                "px-4 py-2 font-medium rounded-full border border-blue-500",
                payments.map((payment) => payment.method).includes(method)
                  ? "bg-blue-500 text-white"
                  : "text-blue-500"
              )}
              onClick={() => onClickPaymentMethod(method)}
            >
              {method}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {payments.map((payment) => {
          return (
            <div key={payment.method} className="flex items-center gap-4">
              <button
                className="w-6 h-6 rounded-sm bg-red-200 text-red-500"
                onClick={() => onClickRemovePayment(payment.method)}
              >
                X
              </button>
              <span className="font-medium">{payment.method}</span>
              <InputBox
                className="ml-auto"
                // value={payment.amount}
                onBlur={(e) => onChangePaymentAmount(payment, +e.target.value)}
              />
            </div>
          );
        })}
      </div>

      <p className="mt-2 font-medium">Amount to pay: {amountToPay}</p>
      <p className="mt-2 font-medium">Total amount: {totalPaymentAmount}</p>

      <p className="mt-2 font-medium text-red-500">{error}</p>

      <div className="mt-4 flex justify-end gap-2">
        <Button className="bg-red-500 hover:bg-red-400" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onClickConfifm}>Confirm</Button>
      </div>
    </div>
  );
}
