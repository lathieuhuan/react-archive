export type VerticalDirection = "T" | "B";
export type HorizontalDirection = "L" | "R";
export type Direction = `${VerticalDirection}${HorizontalDirection}`;

export const netRingCls = "ring-4";
export const netCls = `absolute ${netRingCls} ring-white bg-white/60`;
export const DIRECTIONS: Direction[] = ["TL", "TR", "BR", "BL"];

export const resizerCls = "absolute w-4 h-4 border-red-400";
export const resizerClsByDirection: Record<Direction, string> = {
  TL: "top-0 left-0 rounded-tl-lg border-t-4 border-l-4 cursor-nwse-resize",
  TR: "top-0 right-0 rounded-tr-lg border-t-4 border-r-4 cursor-nesw-resize",
  BR: "bottom-0 right-0 rounded-br-lg border-b-4 border-r-4 cursor-nwse-resize",
  BL: "bottom-0 left-0 rounded-bl-lg border-b-4 border-l-4 cursor-nesw-resize",
};
