const eventsByType = new Map<string, Set<Function>>();
const debugging = false;
let timeout: NodeJS.Timeout | undefined;

function debugLog(message?: any, ...optionalParams: any[]) {
  clearTimeout(timeout);

  if (debugging) {
    console.log(message, ...optionalParams);

    timeout = setTimeout(() => {
      console.log("===============");
    }, 2000);
  }
}

function subscribe(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): void;
function subscribe<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K], options?: boolean | AddEventListenerOptions) => any
): void;
function subscribe<K extends keyof DocumentEventMap>(
  type: K | string,
  listener: ((this: Document, ev: DocumentEventMap[K]) => any) | EventListener,
  options?: boolean | AddEventListenerOptions
) {
  const events = eventsByType.get(type);
  const isDuplicated = events?.has(listener);

  if (events) {
    events.add(listener);
  } else {
    eventsByType.set(type, new Set([listener]));
  }

  debugLog("ADD", type, isDuplicated ? "--DUPLICATE" : undefined);
  document.addEventListener(type as any, listener as any, options as any);
}

function unsubscribe<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | EventListenerOptions
): void;
function unsubscribe(type: string, listener: EventListener, options?: boolean | EventListenerOptions): void;
function unsubscribe<K extends keyof DocumentEventMap>(
  type: K | string,
  listener: ((this: Document, ev: DocumentEventMap[K]) => any) | EventListener,
  options?: boolean | EventListenerOptions
) {
  const removeSuccessful = eventsByType.get(type)?.delete(listener);

  debugLog("REMOVE", type, removeSuccessful ? "--SUCCESS" : "--FAIL");
  document.removeEventListener(type as any, listener as any, options as any);
}

const $events = {
  get subscribersCount() {
    const count: Record<string, number> = {};
    eventsByType.forEach((events, key) => (count[key] = events.size));
    return count;
  },
  subscribe,
  unsubscribe,
};

export default $events;
