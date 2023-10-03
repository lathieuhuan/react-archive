type NumberShema = {
  type: "number";
  max: number;
  min?: number;
  step?: number;
  count?: number;
};

type StringSchema = {
  type: "string";
  len: number;
  count?: number;
};

export type Schema = NumberShema | StringSchema;

export interface IUseMockApiArgs<T extends string> {
  dataSchema: Record<T, Schema>;
  delay?: number;
}

export interface ICallMockApiArgs {
  error?: any;
  delay?: number;
  isError?: boolean;
}
