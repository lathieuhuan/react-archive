import { CaretRightOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { IBranch, IBranchInfo, ICluster } from "../../AppRouter/types";
import { IBranchStatus, IClusterStatus, SetStatusAction } from "./types";
import { countOpen, findAndToggle } from "./utils";

interface ClusterProps {
  parentPath: string,
  openStatus: IClusterStatus;
  cluster: ICluster;
  setOpenStatus: SetStatusAction;
}
export function Cluster(props: ClusterProps) {
  return (
    <>
      {props.cluster.map((branch, i) => {
        return (
          <Branch
            key={i}
            parentPath={props.parentPath}
            openStatus={props.openStatus[i]}
            setOpenStatus={props.setOpenStatus}
            {...branch}
          />
        );
      })}
    </>
  );
}

const CTRL_STYLES = "px-2 py-1 hover:bg-cyan-300 select-none";

interface BranchProps extends IBranch {
  parentPath: string,
  openStatus: IBranchStatus;
  setOpenStatus: SetStatusAction;
}
function Branch(props: BranchProps): JSX.Element {
  const { info, cluster, openStatus, setOpenStatus } = props;

  let height = 0;
  if (cluster) {
    height = (countOpen(openStatus) - 1) * 32;
  }
  const nestedPath = `${props.parentPath}/${info.path}`;

  return (
    <div className="flex flex-col">
      {cluster ? (
        <ClusterCtrl
          info={info}
          open={openStatus.open}
          setOpenStatus={setOpenStatus}
        />
      ) : (
        <NavLink className={CTRL_STYLES} to={nestedPath}>
          {info.name}
        </NavLink>
      )}
      {cluster && openStatus.children && (
        <div
          className="pl-3 overflow-hidden transition-all duration-300"
          style={{ maxHeight: openStatus.open ? `${height}px` : 0 }}
        >
          <Cluster
            parentPath={nestedPath}
            openStatus={openStatus.children}
            setOpenStatus={setOpenStatus}
            cluster={cluster}
          />
        </div>
      )}
    </div>
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
      className={CTRL_STYLES}
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
