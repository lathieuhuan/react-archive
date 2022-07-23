import classNames from "classnames";
import { CSSProperties, Fragment } from "react";
import styles from "./styles.module.scss";

type Column = {
  heading: string | JSX.Element;
  key: string;
  render?: (info: unknown) => string | JSX.Element;
};

interface HuansTableProps {
  className?: string;
  data: Array<Record<string, unknown>>;
  colStyles?: CSSProperties[];
  columns: Column[];
}
export function HuansTable({
  className,
  data,
  colStyles,
  columns,
}: HuansTableProps) {
  return (
    <table className={classNames(styles.table, className)}>
      {colStyles && (
        <colgroup>
          {colStyles.map((style, i) => (
            <col key={i} style={style} />
          ))}
        </colgroup>
      )}
      <thead>
        <tr>
          {columns.map((col, i) => {
            return (
              <td key={i}>
                {typeof col.heading === "string" ? (
                  <span>{col.heading}</span>
                ) : (
                  col.heading
                )}
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => {
          return (
            <Fragment key={i}>
              {i ? <tr className="h-1" /> : null}

              <tr>
                {columns.map((col, j) => {
                  const colData = item[col.key];

                  return (
                    <td key={`${i}-${j}`}>
                      {col.render
                        ? col.render(colData)
                        : typeof colData === "string" && colData}
                    </td>
                  );
                })}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
