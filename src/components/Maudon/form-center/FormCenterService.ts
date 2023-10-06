import { FormValues, Path } from "../types";
import get from "../utils/get";
import isNullOrUndefined from "../utils/isNullOrUndefined";
import isObject from "../utils/isObject";
import set from "../utils/set";
import { InternalFormCenter, ValueWatcher } from "./types";

export class FormCenterService<TFormValues extends FormValues = FormValues> {
  values: FormValues = {};
  valueWatchers: Map<Path<TFormValues>, Set<ValueWatcher<TFormValues>>> = new Map();

  constructor() {
    // this.values = {
    //   ...args.defaultValues,
    // };
  }

  /** Improve this */
  _changeValue = (e: any, path: Path<TFormValues>) => {
    let value;

    if (isNullOrUndefined(e)) {
      value = e;
    } else if ("target" in e) {
      value = (e as any)?.target?.value;
    } else {
      value = e;
    }
    this.setValue(path, value);
  };

  _watchValue = <TPath extends Path<TFormValues>>(
    path: TPath,
    observer: ValueWatcher<TFormValues>
  ): (() => void) => {
    const valueWatchers = this.valueWatchers.get(path);

    if (valueWatchers) {
      valueWatchers.add(observer);
      return () => {
        valueWatchers.delete(observer);
      };
    }

    this.valueWatchers.set(path, new Set([observer]));
    return () => {
      this.valueWatchers.get(path)?.delete(observer);
    };
  };

  setValue: InternalFormCenter<TFormValues>["setValue"] = (path, value, options = {}) => {
    set(this.values, path, value);

    const watchers = this.valueWatchers.get(path);

    if (watchers) {
      watchers.forEach((watcher) => watcher(value));
    }
  };

  getValue: InternalFormCenter<TFormValues>["getValue"] = (path?: Path<TFormValues>) => {
    return path ? get(this.values, path) : this.values;
  };
}
