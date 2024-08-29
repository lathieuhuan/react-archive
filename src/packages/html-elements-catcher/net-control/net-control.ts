import { EventListenerManager } from "../event-listener-manager";
import { netCls, netRingCls } from "./configs";
import { ResizerControl, ResizerElement } from "./resizer-control";

export class NetControl extends EventListenerManager {
  private net: HTMLDivElement;
  private defaultHalfSize: number;
  private anchor = {
    x: 0,
    y: 0,
  };
  private resizerCtrl: ResizerControl;

  //
  private devMode = true;
  private netDescription = document.createElement("div");
  private timeout: NodeJS.Timeout | undefined;

  constructor(private sea: HTMLElement, private prefix: string, private minNetSize: number, defaultSize: number) {
    super();
    this.net = this.createNet(0, 0, 0, 0);
    this.defaultHalfSize = defaultSize / 2;
    this.resizerCtrl = new ResizerControl(prefix);
  }

  private set netStyle(style: Partial<CSSStyleDeclaration>) {
    for (const key in style) {
      if (style[key]) this.net.style[key] = style[key];
    }
    this.dev();
  }

  private get netRect() {
    return this.net.getBoundingClientRect();
  }

  private dev = () => {
    clearTimeout(this.timeout);

    if (this.devMode) {
      this.timeout = setTimeout(() => {
        const { left, top, width, height } = this.net.style;
        const style = { left, top, width, height };

        this.netDescription.innerHTML = `<pre class='text-sm'>${JSON.stringify(style, null, 2)}</pre>`;

        if (!this.net.contains(this.netDescription)) {
          this.net.appendChild(this.netDescription);
        }
      }, 500);
    }
  };

  private removeNet = () => {
    if (this.sea.contains(this.net)) {
      this.sea.removeChild(this.net);
    }
  };

  // ========== SETUP NET ==========

  private createNet = (left: number, top: number, width: number, height: number) => {
    const net = document.createElement("div");
    net.id = `${this.prefix}-net`;
    net.className = netCls;

    this.net = net;
    this.netStyle = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
    return net;
  };

  private updateAnchor = ({ x, y }: { x: number; y: number } = this.netRect) => {
    this.anchor = { x, y };
  };

  private launchNewNet = (left: number, top: number, width = 0, height = 0) => {
    /** Only 1 net at a time so we remove old net */
    this.removeNet();
    this.createNet(left, top, width, height);
    this.sea.appendChild(this.net);
    this.updateAnchor();
  };

  // ========== DEPLOY NET ==========

  private resizeNet = (e: MouseEvent) => {
    const { x, y } = this.anchor;

    this.netStyle = {
      left: `${Math.min(e.x, x)}px`,
      top: `${Math.min(e.y, y)}px`,
      width: `${Math.abs(e.x - x)}px`,
      height: `${Math.abs(e.y - y)}px`,
    };
  };

  private unsubscribeDeployment = () => {
    this.removeListener("mousemove", this.resizeNet);
    this.removeListener("mouseup", this.endNetDeployment);
  };

  startNetDeployment = (e: MouseEvent) => {
    this.launchNewNet(e.x, e.y);

    this.addListenter("mousemove", this.resizeNet);
    this.addListenter("mouseup", this.endNetDeployment);
  };

  private endNetDeployment = (e: MouseEvent) => {
    const { width, height } = this.netRect;

    // If the net user drew is too small, launch new net with default size
    if (width < this.minNetSize || height < this.minNetSize) {
      const { clientWidth, clientHeight } = document.documentElement;
      const startX = Math.max(Math.min(e.x, clientWidth - this.defaultHalfSize) - this.defaultHalfSize, 0);
      const startY = Math.max(Math.min(e.y, clientHeight - this.defaultHalfSize) - this.defaultHalfSize, 0);

      this.launchNewNet(startX, startY, this.defaultHalfSize * 2, this.defaultHalfSize * 2);
    }

    this.net.classList.remove(netRingCls);
    this.net.classList.add("rounded-lg");

    const maxResizerSize = Math.floor(Math.min(this.net.clientWidth, this.net.clientHeight) * 0.45);
    this.resizerCtrl.addResizers(this.net, maxResizerSize);

    this.updateAnchor();
    this.unsubscribeDeployment();
  };

  // ========== ADJUST NET ==========

  isNetResizer = (elmt: HTMLElement) => {
    return this.resizerCtrl.isResizer(elmt);
  };

  startNetAdjustment = (resizer: ResizerElement) => {
    const { netRect } = this;

    switch (resizer.__direction) {
      case "TL":
        this.updateAnchor({
          x: netRect.right,
          y: netRect.bottom,
        });
        break;
      case "TR":
        this.updateAnchor({
          x: netRect.left,
          y: netRect.bottom,
        });
        break;
      case "BR":
        this.updateAnchor(netRect);
        break;
      case "BL":
        this.updateAnchor({
          x: netRect.right,
          y: netRect.top,
        });
        break;
    }

    this.addListenter("mousemove", this.resizeNet);
    this.addListenter("mouseup", this.endNetAdjustment);
  };

  private endNetAdjustment = () => {
    this.updateAnchor();
    this.unsubscribeAdjustment();
  };

  private unsubscribeAdjustment = () => {
    this.removeListener("mousemove", this.resizeNet);
    this.removeListener("mouseup", this.endNetAdjustment);
  };

  disconnect = () => {
    this.unsubscribeAdjustment();
    this.unsubscribeDeployment();
    this.removeNet();
  };
}
