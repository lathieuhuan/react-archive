const MIN_NET_SIZE = 4;
const DEFAULT_NET_HALF_SIZE = 80; // DEFAULT_NET_SIZE is x2 this
const prefix = "HTMLEC";
const catcherCls = "fixed top-0 left-0 z-50 w-full h-full bg-black/40 cursor-crosshair hidden";
const netRingCls = "ring-4";
const netCls = `absolute ${netRingCls} ring-white bg-white/60`;
const resizerCls = "absolute w-4 h-4 border-red-400";

export class HTMLElementsCatcher {
  private net: HTMLDivElement | undefined;
  private startingAt = {
    x: 0,
    y: 0,
  };

  get overlayElmt() {
    let overlay: HTMLDivElement | null = document.querySelector(`#${prefix}`);

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = prefix;
      overlay.className = catcherCls;
      overlay.draggable = false;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  private createNet = (startX: number, startY: number) => {
    const net = document.createElement("div");
    net.id = `${prefix}-net`;
    net.className = netCls;
    net.style.left = `${startX}px`;
    net.style.top = `${startY}px`;
    this.net = this.overlayElmt.appendChild(net);
    return this.net;
  };

  private resize = (elmt: HTMLDivElement, width: number, height: number) => {
    elmt.style.width = `${Math.abs(width)}px`;
    elmt.style.height = `${Math.abs(height)}px`;
  };

  private destroyNet = () => {
    if (this.net) {
      this.overlayElmt.removeChild(this.net);
      this.net = undefined;
    }
  };

  private endSessionOnEscPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.endSession();
    }
  };

  private catchElements = (e: MouseEvent) => {
    if (this.net) {
      this.resize(this.net, e.x - this.startingAt.x, e.y - this.startingAt.y);
    }
  };

  private startCatching = (e: MouseEvent) => {
    this.destroyNet();
    // Create an initial net here is more performant than when mousemove
    this.createNet(e.x, e.y);

    this.startingAt = {
      x: e.x,
      y: e.y,
    };
    document.addEventListener("mousemove", this.catchElements);
  };

  private endCatching = (e: MouseEvent) => {
    const netWidth = Math.abs(e.x - this.startingAt.x);
    const netHeight = Math.abs(e.y - this.startingAt.y);

    if (netWidth < MIN_NET_SIZE || netHeight < MIN_NET_SIZE) {
      const { clientWidth, clientHeight } = document.documentElement;
      const startX = Math.max(Math.min(e.x, clientWidth - DEFAULT_NET_HALF_SIZE) - DEFAULT_NET_HALF_SIZE, 0);
      const startY = Math.max(Math.min(e.y, clientHeight - DEFAULT_NET_HALF_SIZE) - DEFAULT_NET_HALF_SIZE, 0);

      // Destroy the initial net
      this.destroyNet();
      this.resize(this.createNet(startX, startY), DEFAULT_NET_HALF_SIZE * 2, DEFAULT_NET_HALF_SIZE * 2);
    }

    // Style finished net and add resize hanlders
    if (this.net) {
      this.net.classList.remove(netRingCls);
      this.net.classList.add("rounded-lg");
      const maxResizerSize = Math.floor(Math.min(this.net.clientWidth, this.net.clientHeight) * 0.45);

      const resizerClsx = [
        "top-0 left-0 rounded-tl-lg border-t-4 border-l-4 cursor-nwse-resize",
        "top-0 right-0 rounded-tr-lg border-t-4 border-r-4 cursor-nesw-resize",
        "bottom-0 left-0 rounded-bl-lg border-b-4 border-l-4 cursor-nesw-resize",
        "bottom-0 right-0 rounded-br-lg border-b-4 border-r-4 cursor-nwse-resize",
      ];
      for (const cls of resizerClsx) {
        const resizer = document.createElement("div");
        resizer.className = `${resizerCls} ${cls}`;
        resizer.style.maxWidth = `${maxResizerSize}px`;
        resizer.style.maxHeight = `${maxResizerSize}px`;

        this.net.appendChild(resizer);
      }
    }

    this.startingAt = {
      x: 0,
      y: 0,
    };
    document.removeEventListener("mousemove", this.catchElements);
  };

  startSession() {
    this.overlayElmt.classList.remove("hidden");
    document.addEventListener("keydown", this.endSessionOnEscPressed);
    document.addEventListener("mousedown", this.startCatching);
    document.addEventListener("mouseup", this.endCatching);
  }

  endSession() {
    this.destroyNet();
    this.overlayElmt.classList.add("hidden");
    document.removeEventListener("keydown", this.endSessionOnEscPressed);
    document.removeEventListener("mousedown", this.startCatching);
    document.removeEventListener("mousemove", this.catchElements);
    document.removeEventListener("mouseup", this.endCatching);
  }
}
