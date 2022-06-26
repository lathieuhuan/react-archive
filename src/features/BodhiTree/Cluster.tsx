import { CaretRightOutlined, LinkOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { NavLink } from "react-router-dom";

import { IBranch, ICluster } from "../../routes/types";
import { IBranchStatus, IClusterStatus, SetStatusAction } from "./types";
import { countOpen, findAndToggle } from "./utils";

import styles from "./styles.module.scss";

interface ClusterProps {
  parentPath: string;
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

const HEIGHT = 32;

interface BranchProps extends IBranch {
  parentPath: string;
  openStatus: IBranchStatus;
  setOpenStatus: SetStatusAction;
}
function Branch(props: BranchProps): JSX.Element {
  const { info, cluster, openStatus, setOpenStatus } = props;
  const nestedPath = `${props.parentPath}/${info.path}`;

  if (!cluster) {
    return (
      <li className="flex flex-col">
        <NavLink
          className={({ isActive }) =>
            classNames(styles.ctrlBtn, { "!text-yellow-400": isActive })
          }
          style={{ height: `${HEIGHT}px` }}
          to={nestedPath}
        >
          <span className="z-10">
            <LinkOutlined className="w-4 mr-1" />
            {info.name}
          </span>
        </NavLink>
      </li>
    );
  }

  let clusterHeight = (countOpen(openStatus) - 1) * HEIGHT;

  return (
    <li className="flex flex-col">
      <p
        className={styles.ctrlBtn}
        style={{ height: `${HEIGHT}px` }}
        onClick={() => {
          setOpenStatus((prev) => {
            const newStatus = JSON.parse(JSON.stringify(prev));
            findAndToggle(newStatus, info.id);
            return newStatus;
          });
        }}
      >
        <span className="z-10">
          <CaretRightOutlined
            className={classNames("w-4 mr-1 transition-all duration-300", {
              "rotate-90": openStatus.open,
            })}
          />
          {info.name}
        </span>
      </p>

      {openStatus.children && (
        <ul
          className="pl-3 overflow-hidden transition-all duration-300"
          style={{ maxHeight: openStatus.open ? `${clusterHeight}px` : 0 }}
        >
          <Cluster
            parentPath={nestedPath}
            openStatus={openStatus.children}
            setOpenStatus={setOpenStatus}
            cluster={cluster}
          />
        </ul>
      )}
    </li>
  );
}
