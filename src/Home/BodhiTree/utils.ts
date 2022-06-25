import { IBranchStatus, IClusterStatus } from "./types";

export function findAndToggle(status: IClusterStatus, id?: number): void {
  for (const st of status) {
    if (st.id === id) {
      st.open = !st.open;
      break;
    } else if (st.children) {
      findAndToggle(st.children, id);
    }
  }
}

export function countOpen(status: IBranchStatus): number {
  let result = 0;
  if (status.children) {
    // not last branch
    result += status.open ? 1 : 0;
    for (const branch of status.children) {
      result += countOpen(branch);
    }
  } else {
    // last branch
    result++;
  }
  return result;
}
