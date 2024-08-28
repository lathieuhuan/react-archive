import { prefix, MIN_NET_SIZE } from "./configs";
import { NetControl } from "./net-control";

const DEFAULT_NET_HALF_SIZE = 80; // DEFAULT_NET_SIZE is x2 this
const catcherCls = "fixed top-0 left-0 z-50 w-full h-full bg-black/40 cursor-crosshair hidden";

export class HTMLElementsCatcher {
  private netCtrl = new NetControl();

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

  private endSessionOnEscPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.endSession();
    }
  };

  private catchElements = (net: HTMLDivElement) => {
    // const { clientWidth, clientHeight } = document.documentElement;
    const { top, left, width, height } = net.getBoundingClientRect();

    document.querySelectorAll("*").forEach((element) => {
      if (!element.closest(`#${prefix}`)) {
        const rect = element.getBoundingClientRect();

        if (rect.left >= left && rect.top >= top && rect.right <= left + width && rect.bottom <= top + height) {
          if ("style" in element) {
            (element.style as any).backgroundColor = "red";
          } else {
            console.log(element);
          }
        }
      }
    });
  };

  // ========== THROW NET ==========

  private startCatching = (e: MouseEvent) => {
    this.netCtrl.launchNewNet(this.overlayElmt, e.x, e.y);
    this.netCtrl.startNetDeployment();

    document.addEventListener("mouseup", this.endCatching);
  };

  private endCatching = (e: MouseEvent) => {
    const { width, height } = this.netCtrl.netRect;

    if (width < MIN_NET_SIZE || height < MIN_NET_SIZE) {
      const { clientWidth, clientHeight } = document.documentElement;
      const startX = Math.max(Math.min(e.x, clientWidth - DEFAULT_NET_HALF_SIZE) - DEFAULT_NET_HALF_SIZE, 0);
      const startY = Math.max(Math.min(e.y, clientHeight - DEFAULT_NET_HALF_SIZE) - DEFAULT_NET_HALF_SIZE, 0);

      this.netCtrl.launchNewNet(this.overlayElmt, startX, startY, DEFAULT_NET_HALF_SIZE * 2, DEFAULT_NET_HALF_SIZE * 2);
    }

    this.netCtrl.endNetDeployment();
  };

  handleMousedown = (e: MouseEvent) => {
    const { target } = e;

    if (target instanceof HTMLElement) {
      if (this.netCtrl.isNetResizer(target)) {
        this.netCtrl.startNetAdjustment(e, target);
        return;
      }

      this.startCatching(e);
    }
  };

  startSession() {
    this.overlayElmt.classList.remove("hidden");
    document.addEventListener("keydown", this.endSessionOnEscPressed);
    document.addEventListener("mousedown", this.handleMousedown);
  }

  endSession() {
    this.overlayElmt.classList.add("hidden");
    this.netCtrl.disconnect();
    document.removeEventListener("keydown", this.endSessionOnEscPressed);
    document.removeEventListener("mousedown", this.handleMousedown);
    document.removeEventListener("mouseup", this.endCatching);
  }
}
