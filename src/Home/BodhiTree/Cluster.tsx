import { CaretRightOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { IBranch, IBranchInfo, ICluster } from "../../routes";
import { IBranchStatus, IClusterStatus, SetStatusAction } from "./types";
import { countOpen, findAndToggle } from "./utils";

interface ClusterProps {
  openStatus: IClusterStatus;
  cluster: ICluster;
  setOpenStatus: SetStatusAction;
}
export function Cluster(props: ClusterProps) {
  return (
    <div>
      {props.cluster.map((branch, i) => {
        return (
          <Branch
            key={i}
            openStatus={props.openStatus[i]}
            setOpenStatus={props.setOpenStatus}
            {...branch}
          />
        );
      })}
    </div>
  );
}

interface BranchProps extends IBranch {
  openStatus: IBranchStatus;
  setOpenStatus: SetStatusAction;
}
function Branch(props: BranchProps): JSX.Element {
  const { info, cluster, openStatus, setOpenStatus } = props;
  let height = 0;
  if (cluster) {
    height = countOpen(openStatus) * 24;
  }

  return (
    <>
      {cluster ? (
        <ClusterCtrl
          info={info}
          open={openStatus.open}
          setOpenStatus={setOpenStatus}
        />
      ) : (
        <p>{info.name}</p>
      )}
      {cluster && openStatus.children && (
        <div
          className="pl-3 overflow-hidden transition-all duration-300"
          style={{ maxHeight: openStatus.open ? `${height}px` : 0 }}
        >
          <Cluster
            openStatus={openStatus.children}
            setOpenStatus={setOpenStatus}
            cluster={cluster}
          />
        </div>
      )}
    </>
  );
}

interface FolderTitleProps {
  info: IBranchInfo;
  open: boolean;
  setOpenStatus: SetStatusAction;
}
function ClusterCtrl(props: FolderTitleProps) {
  return (
    <p
      onClick={() => {
        props.setOpenStatus((prev) => {
          const newStatus = JSON.parse(JSON.stringify(prev));
          findAndToggle(newStatus, props.info.id);
          return newStatus;
        });
      }}
    >
      <CaretRightOutlined
        className={classNames("mr-2 transition-all duration-300", {
          "rotate-90": props.open,
        })}
      />
      {props.info.name}
    </p>
  );
}
