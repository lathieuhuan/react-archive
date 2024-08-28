import { prefix, MIN_NET_SIZE } from "./configs";

type Position = {
  x: number;
  y: number;
};

const netRingCls = "ring-4";
const netCls = `absolute ${netRingCls} ring-white bg-white/60`;

const resizerIdentityCls = `${prefix}-resizer`;
const resizerCls = "absolute w-4 h-4 border-red-400";
const resizersAttrs = {
  tl: {
    id: `${resizerIdentityCls}--tl`,
    cls: `top-0 left-0 rounded-tl-lg border-t-4 border-l-4 cursor-nwse-resize`,
  },
  tr: {
    id: `${resizerIdentityCls}--tr`,
    cls: `top-0 right-0 rounded-tr-lg border-t-4 border-r-4 cursor-nesw-resize`,
  },
  br: {
    id: `${resizerIdentityCls}--br`,
    cls: `bottom-0 right-0 rounded-br-lg border-b-4 border-r-4 cursor-nwse-resize`,
  },
  bl: {
    id: `${resizerIdentityCls}--bl`,
    cls: `bottom-0 left-0 rounded-bl-lg border-b-4 border-l-4 cursor-nesw-resize`,
  },
};

export class NetControl {
  private net: HTMLDivElement;
  private sea: HTMLElement | undefined;
  private anchor: Position = {
    x: 0,
    y: 0,
  };
  private adjustDir: "tl" | "tr" | "br" | "bl" = "br";

  constructor() {
    this.net = this.createNet();
  }

  get netRect() {
    return this.net.getBoundingClientRect();
  }

  private removeNet = () => {
    if (this.sea?.contains(this.net)) {
      this.sea.removeChild(this.net);
    }
  };

  // ========== SETUP NET ==========

  private createNet = (startX = 0, startY = 0, width = 0, height = 0) => {
    const net = document.createElement("div");
    net.id = `${prefix}-net`;
    net.className = netCls;
    net.style.left = `${startX}px`;
    net.style.top = `${startY}px`;
    this.resizeNet(width, height);
    return (this.net = net);
  };

  set netStyle(style: Partial<CSSStyleDeclaration>) {
    for (const key in style) {
      if (style[key]) this.net.style[key] = style[key];
    }
  }

  private resizeNet = (width: number, height: number) => {
    this.netStyle = {
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  private launchNet = (sea: HTMLElement) => {
    sea.appendChild(this.net);

    const { x, y } = this.netRect;
    this.anchor = { x, y };
    this.sea = sea;
  };

  launchNewNet = (sea: HTMLElement, startX = 0, startY = 0, width = 0, height = 0) => {
    /** Only 1 net at a time so we remove old net */
    this.removeNet();
    this.createNet(startX, startY, Math.abs(width), Math.abs(height));
    this.launchNet(sea);
  };

  // ========== DEPLOY NET ==========

  private deployNet = (e: MouseEvent) => {
    this.resizeNet(Math.abs(e.x - this.anchor.x), Math.abs(e.y - this.anchor.y));
  };

  private deactivateNet = () => {
    document.removeEventListener("mousemove", this.deployNet);
  };

  startNetDeployment = () => {
    document.addEventListener("mousemove", this.deployNet);
  };

  endNetDeployment = () => {
    this.net.classList.remove(netRingCls);
    this.net.classList.add("rounded-lg");
    const maxResizerSize = Math.floor(Math.min(this.net.clientWidth, this.net.clientHeight) * 0.45);

    for (const attrs of Object.values(resizersAttrs)) {
      const resizer = document.createElement("div");
      resizer.id = attrs.id;
      resizer.className = `${resizerIdentityCls} ${resizerCls} ${attrs.cls}`;
      resizer.style.maxWidth = `${maxResizerSize}px`;
      resizer.style.maxHeight = `${maxResizerSize}px`;

      this.net.appendChild(resizer);
    }

    this.deactivateNet();
  };

  // ========== ADJUST NET ==========

  isNetResizer = (elmt: HTMLElement) => {
    return elmt.classList.contains(resizerIdentityCls);
  };

  private adjustNet = (e: MouseEvent) => {
    const { x, y } = this.netRect;

    // #to-do: Resize net base on this.anchor and e.x & e.y

    switch (this.adjustDir) {
      case "tl":
        break;
      case "br":
        this.resizeNet(Math.max(e.x - x, MIN_NET_SIZE), Math.max(e.y - y, MIN_NET_SIZE));
        break;
    }
  };

  startNetAdjustment = (e: MouseEvent, resizer: HTMLElement) => {
    const { top, left, right, bottom } = this.netRect;
    const { clientWidth, clientHeight } = document.documentElement;

    // #to-do: Update this.anchor

    switch (resizer.id) {
      case resizersAttrs.tl.id:
        this.netStyle = {
          left: "unset",
          top: "unset",
          right: `${clientWidth - right}px`,
          bottom: `${clientHeight - bottom}`,
        };
        this.adjustDir = "tl";
        break;
      case resizersAttrs.tr.id:
        this.netStyle = {
          left: `${left}px`,
          top: "unset",
          right: "unset",
          bottom: `${clientHeight - bottom}`,
        };
        this.adjustDir = "tr";
        break;
      case resizersAttrs.br.id:
        this.netStyle = {
          left: `${left}px`,
          top: `${top}px`,
          right: "unset",
          bottom: "unset",
        };
        this.adjustDir = "br";
        break;
      case resizersAttrs.bl.id:
        this.netStyle = {
          left: "unset",
          top: `${top}px`,
          right: `${clientWidth - right}px`,
          bottom: "unset",
        };
        this.adjustDir = "bl";
        break;
    }

    document.addEventListener("mousemove", this.adjustNet);
    document.addEventListener("mouseup", this.endNetAdjustment);
  };

  private endNetAdjustment = () => {
    document.removeEventListener("mousemove", this.adjustNet);
    document.removeEventListener("mouseup", this.endNetAdjustment);
  };

  disconnect = () => {
    this.endNetAdjustment();
    this.deactivateNet();
    this.removeNet();
  };
}
