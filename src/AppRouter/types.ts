export type IBranchInfo = {
  id: number;
  name: string;
  path: string;
};

export interface IBranch {
  info: IBranchInfo;
  component?: React.FC;
  cluster?: ICluster;
}

export type ICluster = Array<IBranch>;