import { catcherCls, DEFAULT_NET_HALF_SIZE, MIN_NET_SIZE, prefix } from "./configs";
import { EventListenerManager } from "./event-listener-manager";
import { NetControl } from "./net-control";

type CatcherConstructOpions = {
  closeOnEscape?: boolean;
};

const defaultOptions: CatcherConstructOpions = {
  closeOnEscape: true,
};

export class HTMLElementsCatcher extends EventListenerManager {
  private previousBodyOverflow = "";
  private netCtrl = new NetControl(this.overlayElmt, prefix, MIN_NET_SIZE, DEFAULT_NET_HALF_SIZE * 2);

  constructor(private options: CatcherConstructOpions = defaultOptions) {
    super();
  }

  private get overlayElmt() {
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
    if (e.key === "Escape" && this.options.closeOnEscape) {
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

  private handleMousedown = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      this.netCtrl.isNetResizer(e.target)
        ? this.netCtrl.startNetAdjustment(e.target)
        : this.netCtrl.startNetDeployment(e);
    }
  };

  startSession() {
    this.previousBodyOverflow = getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    this.overlayElmt.classList.remove("hidden");
    this.addListenter("keydown", this.endSessionOnEscPressed);
    this.addListenter("mousedown", this.handleMousedown);
  }

  endSession() {
    document.body.style.overflow = this.previousBodyOverflow;

    this.overlayElmt.classList.add("hidden");
    this.netCtrl.disconnect();
    this.removeListener("keydown", this.endSessionOnEscPressed);
    this.removeListener("mousedown", this.handleMousedown);
  }
}
