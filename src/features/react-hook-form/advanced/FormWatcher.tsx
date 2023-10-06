import { useMemo } from "react";
import { PathValue, FieldValues, Path, useWatch } from "react-hook-form";

type Values<TFieldValues extends FieldValues, TPath extends Path<TFieldValues>[] | readonly Path<TFieldValues>[]> = {
  [K in TPath[number]]: PathValue<TFieldValues, K>;
};

type ReturnElement = React.ReactElement | null;

export function FormWatcher<
  TFieldValues extends FieldValues = FieldValues,
  TFieldNames extends readonly Path<TFieldValues>[] = readonly Path<TFieldValues>[]
>(props: { paths: TFieldNames; children: (values: Values<TFieldValues, TFieldNames>) => ReturnElement }): ReturnElement;

export function FormWatcher<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
>(props: { paths: TFieldName; children: (value: PathValue<TFieldValues, TFieldName>) => ReturnElement }): ReturnElement;

export function FormWatcher({ paths, children }: { paths: string; children: (values: any) => ReturnElement }) {
  const watchedValues = useWatch({ name: paths });

  const values = useMemo(
    () =>
      Array.isArray(watchedValues)
        ? watchedValues.reduce((result, watchedValue, i) => Object.assign(result, { [paths[i]]: watchedValue }), {})
        : watchedValues,
    [watchedValues]
  );
  return children(values);
}
