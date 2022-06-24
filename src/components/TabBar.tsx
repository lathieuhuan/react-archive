import cn from "classnames";
import { useEffect, useRef } from "react";
import { ComponentProps } from "./types";

interface TopBarProps extends ComponentProps {
  tabs: string[];
  selectedIndex: number;
  onSelect?: (index: number) => void;
}

export default function TabBar(props: TopBarProps) {
  const { className, tabs, selectedIndex, onSelect, ...rest } = props;
  const ref = useRef<number[]>([]);

  useEffect(() => {
    const tabbarBtns =
      document.querySelectorAll<HTMLButtonElement>(".tabbar-button")!;
    const widths: number[] = [];
    tabbarBtns.forEach((btn) => {
      widths.push(btn.clientWidth);
    });
    ref.current = widths;
  }, []);

  useEffect(() => {
    const indicator = document.querySelector<HTMLDivElement>(
      "#tabbar-active-indicator"
    )!;
    indicator.style.width = `${ref.current[selectedIndex]}px`;
    indicator.style.transform = `translateX(${
      ref.current[selectedIndex - 1] || 0
    }px)`;
  }, [selectedIndex]);

  return (
    <div className={cn(className, "relative bg-slate-200")} {...rest}>
      <div
        id="tabbar-active-indicator"
        className="absolute h-1 w-0 bg-blue-700 transition-all duration-200"
      />
      <div className="flex text-lg">
        {tabs.map((tab, i) => (
          <button
            className={cn("px-4 py-2 tabbar-button", {
              "text-blue-700": i === selectedIndex,
            })}
            key={i}
            onClick={() => {
              if (onSelect) onSelect(i);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
