import { PAYMENT_METHODS } from "./constants";

export type PaymentMethod = typeof PAYMENT_METHODS[number];

export type Payment = {
  method: PaymentMethod;
  amount: number;
  refInfo: string;
};
