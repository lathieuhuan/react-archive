import { IBranch } from "../routes";

export function elmtById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id)! as T;
}

export function countChildBranches(branches: IBranch[]) {
  let result = branches.length;
  for (const branch of branches) {
    if (branch.branches) {
      result += countChildBranches(branch.branches);
    }
  }
  return result;
}

const HEIGHT = 24;

export function toggleCluster(clusterId: string, numOfChildBranches: number) {
  // const cluster = elmtById<HTMLDivElement>(clusterId);
  const clusterWrapper = elmtById<HTMLDivElement>(clusterId + "-wrapper");
  const caret = elmtById<HTMLSpanElement>(clusterId + "-caret");

  if (clusterWrapper.classList.contains("growing")) {
    clusterWrapper.style.height = "0px";
    caret.style.transform = "rotate(0)";
  } else {
    clusterWrapper.style.height = `${numOfChildBranches * HEIGHT}px`;
    caret.style.transform = "rotate(90deg)";
  }
  clusterWrapper.classList.toggle("growing");
}
