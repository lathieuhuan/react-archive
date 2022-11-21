import { numberFormat } from "@Utils/index";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ProductTable } from "./Core";

const { Header, Row } = ProductTable;

const items = [
  {
    id: "123456789",
    name: "Item 1",
    unit: "lon",
    amount: 3,
    price: 50000,
  },
  {
    id: "08081508",
    name: "Item 2",
    unit: "kg",
    amount: 8,
    price: 15000,
  },
];

export default function Table() {
  const { t } = useTranslation();

  return (
    <div style={{ width: 900, height: 426 }}>
      <p className="text-xl font-bold">Table with ::after</p>
      <p className="mt-2">Use ::after to round each row of the table.</p>

      <div className="mt-4">
        <ProductTable colsConfig={["w-10", "w-60", "w-24", "w-20", "w-24", "w-28"]}>
          <Header
            commonCellClassName="pt-2 pb-5"
            className="text-sm font-medium text-ink-400"
            afterClassName="after:border-ink-200"
            columns={[
              {},
              { content: t("Name") },
              {
                className: "pl-2 text-center",
                content: t("Price"),
              },
              {
                className: "pl-2 text-center",
                content: t("Amount"),
              },
              {
                className: "pl-2 text-center",
                content: t("Unit"),
              },
              {
                className: "pl-2 pr-3 text-center",
                content: t("Total"),
              },
            ]}
          />
          {items.map((item, i) => {
            return (
              <Fragment key={i}>
                <Row
                  roundedTop
                  roundedBottom
                  commonCellClassName="py-3"
                  columns={[
                    {
                      className: "text-center",
                      content: i + 1,
                    },
                    {
                      content: (
                        <>
                          <p className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">{item.name}</p>
                          <p className="text-ink-400">{item.id}</p>
                        </>
                      ),
                    },
                    {
                      className: "pl-2 text-center text-blue-500",
                      content: numberFormat(item.price),
                    },
                    {
                      className: "pl-2 text-center",
                      content: <label className="border-b px-1">{item.amount}</label>,
                    },
                    {
                      className: "pl-2 text-center",
                      content: item.unit,
                    },
                    {
                      className: "pl-2 text-center text-blue-500 font-bold",
                      content: numberFormat(item.amount * item.price),
                    },
                  ]}
                />
                <tr className="h-2" />
              </Fragment>
            );
          })}
        </ProductTable>
      </div>
    </div>
  );
}
