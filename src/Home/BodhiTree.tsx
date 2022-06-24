import { CaretRightOutlined } from "@ant-design/icons";
import { memo, useEffect, useRef } from "react";
import { branches, IBranch } from "../routes";
import { countChildBranches, toggleCluster } from "./utils";

function Branch({ name, path, branches }: Partial<IBranch>): JSX.Element {
  const clusterId = `bodhi-branch-${path || ""}`;
  const childBranches = useRef(0);
  
  useEffect(() => {
    if (branches) {
      childBranches.current = countChildBranches(branches);
    }
  }, []);

  return (
    <>
      {name && path && (
        <p onClick={() => toggleCluster(clusterId, childBranches.current)}>
          {branches && (
            <CaretRightOutlined
              id={clusterId + "-caret"}
              className="mr-2 transition-all duration-300"
            />
          )}
          {name}
        </p>
      )}
      {branches && <Cluster clusterId={clusterId} branches={branches} />}
    </>
  );
}

interface ClusterProps {
  growing?: boolean;
  branches: IBranch[];
  clusterId: string;
}

function Cluster(props: ClusterProps) {
  return (
    <div
      id={props.clusterId + "-wrapper"}
      className="pl-3 overflow-hidden transition-all duration-300"
      style={{ height: props.growing ? "auto" : 0 }}
    >
      <div id={props.clusterId}>
        {props.branches.map((branch, i) => {
          return <Branch key={i} {...branch} />;
        })}
      </div>
    </div>
  );
}

const BodhiTree = memo(() => (
  <Cluster clusterId="bodhi-root" growing branches={branches} />
));

export default BodhiTree;
