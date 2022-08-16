import React, {CSSProperties, HTMLAttributes, ReactNode} from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

interface ColumnsType {
  key?: string;
  cellClassName?: string;
  className?: string;
  colSpan?: number;
  content?: string | number | JSX.Element;
  onClick?: () => void
}

interface TableWithAfterProps {
  className?: string;
  colsConfig?: Array<undefined |string | {
    className?: string,
    style?: CSSProperties
  }>;
  children: ReactNode;
}
const ProductTable = ({className, colsConfig, children}: TableWithAfterProps) => {
    return (
        <table className={classNames('border-collapse relative', styles.table, className)}>
            {colsConfig && colsConfig.length && (
                <colgroup>
                    {
                        colsConfig.map((config, i) => typeof config === 'undefined'
                            ? <col key={i} />
                            : typeof config === 'string'
                                ? <col key={i} className={config} />
                                : <col key={i} className={config.className} style={config.style} />)
                    }
                </colgroup>
            )}
            <tbody>{children}</tbody>
        </table>
    );
};

interface HeaderProps extends HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  /**
   * tailwind after:bg-[color], after:border-[color]
   */
  afterClassName?: string;
  /**
   * tailwind pt, pb, py
   */
  paddingY?: string;
  sticky?: boolean;
  columns: Array<ColumnsType>,
}
ProductTable.Header = ({
    className,
    paddingY,
    afterClassName,
    sticky = true,
    columns,
    ...rest
}: HeaderProps) => {
    return (
        <tr className={classNames(sticky && 'sticky top-0 z-10', className)} {...rest}>
            {columns.map(({key, cellClassName, className, colSpan, content, onClick}, i) => {
                return (
                    <th key={key || i} className={classNames(paddingY, afterClassName, cellClassName)} colSpan={colSpan} onClick={onClick}>
                        <div className={className}>{content}</div>
                    </th>
                );
            })}
        </tr>
    );
};

interface RowProps {
  className?: string;
  afterClassName?: string;
  paddingY?: string;
  roundedTop?: boolean;
  roundedBottom?: boolean;
  columns: Array<ColumnsType>;
}
ProductTable.Row = ({className, afterClassName, paddingY, roundedTop, roundedBottom, columns}: RowProps) => {
    return (
        <tr
            className={classNames(
                styles.tr,
                roundedTop && styles['tr-first'],
                roundedBottom && styles['tr-last'],
                className
            )}
        >
            {columns.map(({key, cellClassName, className, colSpan, content, onClick}, i) => {
                return (
                    <td key={key || i} className={classNames(paddingY, afterClassName, cellClassName)} colSpan={colSpan} onClick={onClick}>
                        <div className={className}>{content}</div>
                    </td>
                );
            })}
        </tr>
    );
};

export {ProductTable};
