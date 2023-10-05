import { FieldPath, FieldPathValues, FieldValues, Path, PathValue, useWatch } from "react-hook-form";

export function FormWatcher<
  TFieldValues extends FieldValues = FieldValues,
  TFieldNames extends readonly FieldPath<TFieldValues>[] = readonly FieldPath<TFieldValues>[]
>(props: {
  paths: TFieldNames;
  children: (values: FieldPathValues<TFieldValues, TFieldNames>) => React.ReactElement | null;
}) {
  const watched = useWatch<TFieldValues, TFieldNames>({ name: props.paths });
  return props.children(watched);
}
