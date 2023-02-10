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

type Schema = NumberShema | StringSchema;

export interface IUseFakeApiArgs {
  dataSchema: Record<string, Schema>;
}

export interface ICallFakeApiArgs {
  error?: any;
  delay?: number;
  isError?: boolean;
}
