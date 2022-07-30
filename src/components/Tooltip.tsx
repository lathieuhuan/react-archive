import classNames from "classnames";

type Placement = "top" | "bottom" | "right" | "left";

interface TooltipProps {
  className?: string;
  text: string;
  placement?: Placement;
}
export default function Tooltip(props: TooltipProps) {
  const classNameByPlacement: Record<Placement, string> = {
    top: "tooltip-top bottom-full left-0 right-0 mb-2 origin-[bottom_center] after:top-full after:left-1/2 after:-translate-x-1/2",
    bottom: "tooltip-bottom top-full left-0 right-0 mt-2 origin-[top_center] after:bottom-full after:left-1/2 after:-translate-x-1/2",
    right: "",
    left: "",
  };
  return (
    <span
      className={classNames(
        "absolute z-20 w-full px-4 py-2 rounded bg-black text-white scale-0 transition-transform duration-200 group-hover:scale-100 after:border-4 after:absolute",
        classNameByPlacement[props.placement || "top"],
        props.className
      )}
    >
      {props.text}
    </span>
  );
}
