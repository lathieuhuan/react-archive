let timeout: NodeJS.Timeout | undefined;

export class EventListenerManager {
  private eventsByType = new Map<string, Set<Function>>();
  private debugging = true;

  private debugLog(message?: any, ...optionalParams: any[]) {
    clearTimeout(timeout);

    if (this.debugging) {
      console.log(message, ...optionalParams);

      timeout = setTimeout(() => {
        console.log("===============");
      }, 2000);
    }
  }

  protected addListenter(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): void;
  protected addListenter<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K], options?: boolean | AddEventListenerOptions) => any
  ): void;
  protected addListenter<K extends keyof DocumentEventMap>(
    type: K | string,
    listener: ((this: Document, ev: DocumentEventMap[K]) => any) | EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    const events = this.eventsByType.get(type);
    const isDuplicated = events?.has(listener);

    if (events) {
      events.add(listener);
    } else {
      this.eventsByType.set(type, new Set([listener]));
    }

    this.debugLog("ADD", type, isDuplicated ? "--DUPLICATE" : undefined);
    document.addEventListener(type as any, listener as any, options as any);
  }

  protected removeListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  protected removeListener(type: string, listener: EventListener, options?: boolean | EventListenerOptions): void;
  protected removeListener<K extends keyof DocumentEventMap>(
    type: K | string,
    listener: ((this: Document, ev: DocumentEventMap[K]) => any) | EventListener,
    options?: boolean | EventListenerOptions
  ) {
    const removeSuccessful = this.eventsByType.get(type)?.delete(listener);

    this.debugLog("REMOVE", type, removeSuccessful ? "--SUCCESS" : "--FAIL");
    document.removeEventListener(type as any, listener as any, options as any);
  }

  get listenersCount() {
    const count: Record<string, number> = {};
    this.eventsByType.forEach((events, key) => (count[key] = events.size));
    return count;
  }
}
