import { Direction, DIRECTIONS, resizerCls, resizerClsByDirection } from "./configs";

export type ResizerElement = HTMLDivElement & {
  __direction: Direction;
};

export class ResizerControl {
  private identityCls: string;

  constructor(prefix: string) {
    this.identityCls = `${prefix}-resizer`;
  }

  private makeResizer(direction: Direction, maxResizerSize: number): ResizerElement {
    const resizer = document.createElement("div");
    resizer.id = `${this.identityCls}-${direction}`;
    resizer.className = `${this.identityCls} ${resizerCls} ${resizerClsByDirection[direction]}`;
    resizer.style.maxWidth = `${maxResizerSize}px`;
    resizer.style.maxHeight = `${maxResizerSize}px`;

    Object.assign(resizer, { __direction: direction });

    return resizer as ResizerElement;
  }

  addResizers(net: HTMLElement, maxResizerSize: number) {
    for (const direction of DIRECTIONS) {
      net.appendChild(this.makeResizer(direction, maxResizerSize));
    }
  }

  isResizer(elmt: HTMLElement | ResizerElement): elmt is ResizerElement {
    return elmt.classList.contains(this.identityCls);
  }
}
