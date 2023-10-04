import { TFormValues, TInternalFormCenter, TSubscriber } from "./types";

export class FormCenterService<T extends TFormValues = TFormValues> {
  values: TFormValues = {};
  subscribers: Map<string, Set<TSubscriber<any>>> = new Map();

  constructor() {
    // this.values = {
    //   ...args.defaultValues,
    // };
  }

  _changeValue = (path: string) => (e: any) => {
    //
  };

  _watchValue = <K extends keyof T>(path: K, observer: TSubscriber<K>): (() => void) => {
    const subscribers = this.subscribers.get(path as string);

    if (subscribers) {
      subscribers.add(observer);
      return () => {
        subscribers.delete(observer);
      };
    }

    this.subscribers.set(path as string, new Set([observer]));
    return () => {
      this.subscribers.get(path as string)?.delete(observer);
    };
  };

  register: TInternalFormCenter["register"] = (path) => {
    return {
      onChange: this._changeValue(path),
    };
  };

  setValue: TInternalFormCenter["setValue"] = (path, value, options = {}) => {
    //
  };

  getValue: TInternalFormCenter["getValue"] = () => {
    //
  };
}
