import { useTranslation } from "react-i18next";
import { ProductTable } from "./Core";

const { Header, Row } = ProductTable;

const numberFormat = (num: number) => num;

const entries = [
  {
    id: "497564942242802016",
    orderEntryId: "497635310981325236",
    amount: 50000,
    receivedQuantity: 2,
    totalAmount: 100000,
    orderEntry: {
      id: "497635310981325236",
      barcode: "",
      productId: "10001949_DTH",
      productName: "XUÂN HOA Bát giấy Kraf 13cm 10cái",
      isRemovable: true,
      status: "SUCCESS",
      position: 1,
      quantity: 20,
      maxQuantity: 999999999,
      returnMaxQuantity: 20,
      unit: "G1",
      price: 50000,
      salePrice: 50000,
      original: 50000,
      totalAmount: 1000000,
      discounts: [],
      isCouponApplied: false,
      isDecimal: false,
      decimalDigit: 0,
    },
  },
];

export default function Table() {
  const { t } = useTranslation();

  return (
    <div className="" style={{ width: 900, height: 426 }}>
      <div className="mt-4">
        <ProductTable colsConfig={["w-5", "w-40", "w-20", "w-16", "w-24", "w-28"]}>
          <Header
            paddingY="pt-2 pb-5"
            className="text-xs font-medium text-ink-400"
            afterClassName="after:border-ink-200"
            columns={[
              {},
              { content: t("Name") },
              {
                className: "pl-2 text-center",
                content: t("Unit"),
              },
              {
                className: "pl-2 text-center",
                content: t("Quantity or Volume"),
              },
              {
                className: "pl-2 text-center",
                content: t("Price"),
              },
              {
                className: "px-2 text-center",
                content: t("Return money"),
              },
            ]}
          />
          {entries.map((entry, i) => {
            return (
              <Row
                key={i}
                columns={[
                  {
                    content: i + 1,
                  },
                  {
                    className: "pl-2 ",
                    content: (
                      <>
                        <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                          {entry?.orderEntry?.productName}
                        </p>
                        <p className="font-normal text-ink-400">{entry?.orderEntry?.barcode}</p>
                      </>
                    ),
                  },
                  {
                    className: "pl-2 text-center font-bold text-blue-500",
                    content: entry?.orderEntry?.unit,
                  },
                  {
                    className: "pl-2 text-center",
                    content: <label className="border-b px-1">{entry?.receivedQuantity}</label>,
                  },
                  {
                    className: "pl-2 text-center text-blue-500",
                    content: numberFormat(entry?.orderEntry?.salePrice || 0),
                  },
                  {
                    className: "pl-2 text-center text-blue-500",
                    content: numberFormat(entry?.totalAmount || 0),
                  },
                ]}
              />
            );
          })}
        </ProductTable>
      </div>
    </div>
  );
}
