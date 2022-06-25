import { memo, useState } from "react";
import { topCluster } from "../../AppRouter/routes";
import { ICluster } from "../../AppRouter/types";
import { Cluster } from "./Cluster";
import { IBranchStatus, IClusterStatus } from "./types";

function getOpenStatus(cluster: ICluster): IClusterStatus {
  const result: IClusterStatus = [];

  for (const branch of cluster) {
    const openStatus: IBranchStatus = {
      id: branch.info.id,
      open: false,
    };
    if (branch.cluster) {
      openStatus.children = getOpenStatus(branch.cluster);
    }
    result.push(openStatus);
  }
  return result;
}

const BodhiTree = memo(() => {
  const [openStatus, setOpenStatus] = useState(getOpenStatus(topCluster));

  return (
    <div className="w-full h-full px-2 pt-28 pb-8 bg-myblue-darkest">
      <Cluster
        parentPath=""
        openStatus={openStatus}
        setOpenStatus={setOpenStatus}
        cluster={topCluster}
      />
    </div>
  );
});

export default BodhiTree;
