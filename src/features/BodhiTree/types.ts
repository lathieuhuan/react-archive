export interface IBranchStatus {
  id: number;
  open: boolean;
  children?: IClusterStatus;
}

export type IClusterStatus = Array<IBranchStatus>;

export type SetStatusAction = React.Dispatch<React.SetStateAction<IClusterStatus>>;