import { prefix, MIN_NET_SIZE } from "./configs";
import { EventListenerManager } from "./event-listener-manager";

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

export class NetControl extends EventListenerManager {
  private net: HTMLDivElement;
  private sea: HTMLElement | undefined;
  private anchor: Position = {
    x: 0,
    y: 0,
  };
  private adjustDir: "tl" | "tr" | "br" | "bl" = "br";
  private devMode = true;
  private netDescription = document.createElement("div");
  private timeout: NodeJS.Timeout | undefined;

  constructor() {
    super();
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
    net.style.width = `${width}px`;
    net.style.height = `${height}px`;
    this.dev();
    return (this.net = net);
  };

  get netStyle() {
    return this.net.style;
  }

  set netStyle(style: Partial<CSSStyleDeclaration>) {
    for (const key in style) {
      if (style[key]) this.netStyle[key] = style[key];
    }
    this.dev();
  }

  private dev = () => {
    clearTimeout(this.timeout);

    if (this.devMode) {
      this.timeout = setTimeout(() => {
        const { top, right, bottom, left, width, height } = this.netStyle;
        const style = {
          top,
          right,
          bottom,
          left,
          width,
          height,
        };

        this.netDescription.innerHTML = `<pre class='text-sm'>${JSON.stringify(style, null, 2)}</pre>`;

        if (!this.net.contains(this.netDescription)) {
          this.net.appendChild(this.netDescription);
        }
      }, 1000);
    }
  };

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
    this.removeListener("mousemove", this.deployNet);
  };

  startNetDeployment = () => {
    this.addListenter("mousemove", this.deployNet);
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

  // #to-do: an adjust function for each direction
  private adjustNet = (e: MouseEvent) => {
    console.log("cursor", e.x, e.y);

    const newWidth = e.x - this.anchor.x;
    const newHeight = e.y - this.anchor.y;

    this.resizeNet(Math.abs(Math.max(newWidth, MIN_NET_SIZE)), Math.abs(Math.max(newHeight, MIN_NET_SIZE)));
  };

  startNetAdjustment = (e: MouseEvent, resizer: HTMLElement) => {
    const { top, left, right, bottom } = this.netRect;
    const { clientWidth, clientHeight } = document.documentElement;

    switch (resizer.id) {
      case resizersAttrs.tl.id:
        this.netStyle = {
          left: "unset",
          top: "unset",
          right: `${clientWidth - right}px`,
          bottom: `${clientHeight - bottom}px`,
        };
        this.adjustDir = "tl";
        this.anchor = {
          x: right,
          y: bottom,
        };
        break;
      case resizersAttrs.tr.id:
        this.netStyle = {
          left: `${left}px`,
          top: "unset",
          right: "unset",
          bottom: `${clientHeight - bottom}px`,
        };
        this.adjustDir = "tr";
        this.anchor = {
          x: left,
          y: bottom,
        };
        break;
      case resizersAttrs.br.id:
        this.netStyle = {
          left: `${left}px`,
          top: `${top}px`,
          right: "unset",
          bottom: "unset",
        };
        this.adjustDir = "br";
        this.anchor = {
          x: left,
          y: top,
        };
        break;
      case resizersAttrs.bl.id:
        this.netStyle = {
          left: "unset",
          top: `${top}px`,
          right: `${clientWidth - right}px`,
          bottom: "unset",
        };
        this.anchor = {
          x: right,
          y: top,
        };
        this.adjustDir = "bl";
        break;
    }

    console.log("anchor", this.anchor.x, this.anchor.y);

    this.addListenter("mousemove", this.adjustNet);
    this.addListenter("mouseup", this.endNetAdjustment);
  };

  private endNetAdjustment = () => {
    this.removeListener("mousemove", this.adjustNet);
    this.removeListener("mouseup", this.endNetAdjustment);
  };

  disconnect = () => {
    this.endNetAdjustment();
    this.deactivateNet();
    this.removeNet();
  };
}
