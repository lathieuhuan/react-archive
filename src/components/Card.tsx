import classNames from "classnames";

interface CardProps {
  className?: string;
  children: string | JSX.Element | JSX.Element[];
}
export default function Card(props: CardProps) {
  return (
    <div
      className={classNames(
        "p-4 break-inside-avoid bg-slate-800 text-slate-50 rounded-md shadow",
        "flex flex-col gap-2 shadow-slate-400 hover:ring-4 hover:ring-green-500",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
