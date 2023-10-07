import { FormValues, Path } from "../types";
import { FormRules } from "../types/validate";
import cloneObject from "../utils/cloneObject";
import get from "../utils/get";
import isNullOrUndefined from "../utils/isNullOrUndefined";
import set from "../utils/set";
import { FormCenterConstructOptions, InternalFormCenter, ValueWatcher } from "./types";

export class FormCenterService<TFormValues extends FormValues = FormValues> {
  values = {} as TFormValues;
  valueWatchers: Map<Path<TFormValues>, Set<ValueWatcher<TFormValues>>> = new Map();
  formRules: FormRules<TFormValues> = {};

  constructor({ defaultValues }: FormCenterConstructOptions<TFormValues>) {
    if (defaultValues) {
      this.values = cloneObject(defaultValues) as TFormValues;
    }
  }

  updateFormRules = (newRules: typeof this.formRules) => {
    this.formRules = newRules;
  };

  _watchValue = <TPath extends Path<TFormValues>>(path: TPath, observer: ValueWatcher<TFormValues>): (() => void) => {
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

    // validate onChange
    this.validate(path);

    /**
     * Find and call watchers of all nested values.
     * E.g. set 'a' = { b: 1 } => noti 'a' and 'a.b'
     */
    for (const [key, watchers] of this.valueWatchers.entries()) {
      // #to-do: this is not correct in case setting 'ab' and there's a path 'abc'
      if (key.includes(path)) {
        const notiValue = get(this.values, key);
        watchers.forEach((watcher) => watcher(notiValue));
      }
    }
  };

  getValue: InternalFormCenter<TFormValues>["getValue"] = (path?: Path<TFormValues>) => {
    return path ? get(this.values, path) : this.values;
  };

  validate = (path: Path<TFormValues>) => {
    const rule = this.formRules[path];
    if (!rule) return true;
    const { required } = rule;

    if (required !== undefined) {
      if (
        typeof required === "object"
          ? typeof required.value === "function"
            ? required.value(this.values)
            : required.value
          : required
      ) {
        return !isNullOrUndefined(get(this.values, path));
      }
      return true;
    }
    return true;
  };
}
