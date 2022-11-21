import React, { CSSProperties, HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface IColumnsType {
  /**
   * Key of each column
   */
  key?: string;
  /**
   * on th, td
   */
  cellClassName?: string;
  /**
   * on div inside th, td
   */
  className?: string;
  colSpan?: number;
  /**
   * inside div which is inside th, td
   */
  content?: string | number | JSX.Element;
  onClick?: () => void;
}

interface IRowsType {
  /**
   * tailwind after:bg-[color], after:border-[color]
   */
  afterClassName?: string;
  /**
   * for common padding... e.g. tailwind pt, pb, py...
   */
  commonCellClassName?: string;
}

interface IProductTableProps {
  /**
   * The additional class to table
   */
  className?: string;
  /**
   * Config style for each column of table
   */
  colsConfig?: Array<
    | undefined
    | string
    | {
        className?: string;
        style?: CSSProperties;
      }
  >;
  /**
   * Render cell of table
   */
  children: ReactNode;
}

const ProductTable = ({ className, colsConfig, children }: IProductTableProps) => {
  return (
    <table className={classNames("border-collapse relative", styles.table, className)}>
      {colsConfig && colsConfig.length && (
        <colgroup>
          {colsConfig.map((config, i) =>
            typeof config === "undefined" ? (
              <col key={i} />
            ) : typeof config === "string" ? (
              <col key={i} className={config} />
            ) : (
              <col key={i} className={config.className} style={config.style} />
            )
          )}
        </colgroup>
      )}
      <tbody>{children}</tbody>
    </table>
  );
};

/**
 * sticky default to true, need background color to work properly
 */
interface IHeaderProps extends IRowsType, HTMLAttributes<HTMLTableRowElement> {
  /**
   * The additional class to header
   */
  className?: string;
  /**
   * Sticky header
   */
  sticky?: boolean;
  /**
   * Define style, content(it can be a React Node or a string) and trigger of each cell
   */
  columns: Array<IColumnsType>;
}

export const Header = ({ className, commonCellClassName, afterClassName, sticky = true, columns, ...rest }: IHeaderProps) => {
  return (
    <tr className={classNames(sticky && "sticky top-0 z-10", className)} {...rest}>
      {columns.map(({ key, cellClassName, className, colSpan, content, onClick }, i) => {
        return (
          <th
            key={key || i}
            className={classNames(commonCellClassName, afterClassName, cellClassName)}
            colSpan={colSpan}
            onClick={onClick}
          >
            <div className={className}>{content}</div>
          </th>
        );
      })}
    </tr>
  );
};

Header.defaultProps = {
  sticky: true,
};

interface IRowProps extends IRowsType, HTMLAttributes<HTMLTableRowElement> {
  /**
   * Make row rounded at top left, top right
   */
  roundedTop?: boolean;
  /**
   * Make row rounded at bottom left, bottom right; add bottom border
   */
  roundedBottom?: boolean;
  /**
   * Define style, content(it can be a React Node or a string) and trigger of each cell
   */
  columns: Array<IColumnsType>;
}

export const Row = ({
  className,
  afterClassName,
  commonCellClassName,
  roundedTop,
  roundedBottom,
  columns,
  ...rest
}: IRowProps) => {
  return (
    <tr
      className={classNames(styles.tr, roundedTop && styles["tr-first"], roundedBottom && styles["tr-last"], className)}
      {...rest}
    >
      {columns.map(({ key, cellClassName, className, colSpan, content, onClick }, i) => {
        return (
          <td
            key={key || i}
            className={classNames(commonCellClassName, afterClassName, cellClassName)}
            colSpan={colSpan}
            onClick={onClick}
          >
            <div className={className}>{content}</div>
          </td>
        );
      })}
    </tr>
  );
};

ProductTable.Header = Header;
ProductTable.Row = Row;

export { ProductTable };
