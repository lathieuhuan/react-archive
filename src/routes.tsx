import { QueryClient, QueryClientProvider } from "react-query";
import ReactHookForm from "./react-hook-form";
import ReactQuery from "./react-query";

interface Route {
  title: string;
  path: string;
  component: React.FC;
}

const queryClient = new QueryClient();

export const routes: Array<Route> = [
  {
    title: "React Hook Form",
    path: "react-hook-form",
    component: ReactHookForm,
  },
  {
    title: "React Query",
    path: "react-query",
    component: () => (
      <QueryClientProvider client={queryClient}>
        <ReactQuery />
      </QueryClientProvider>
    ),
  },
];

let branchID = 0;

export type IBranchInfo = {
  id: number;
  name: string;
  path: string;
}
export interface IBranch {
  info: IBranchInfo;
  cluster?: ICluster;
}

export type ICluster = Array<IBranch>;

export const topCluster: ICluster = [
  {
    info: {
      id: branchID++,
      name: "React Hook Form",
      path: "react-hook-form",
    },
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Basic",
          path: "basic",
        },
        cluster: [
          {
            info: {
              id: branchID++,
              name: "Plain Values with Register Options",
              path: "plain-values-with-register-options",
            },
          },
          {
            info: {
              id: branchID++,
              name: "Nested Values with Yup Validation",
              path: "nested-values-with-yup-validation",
            },
          },
        ],
      },
    ],
  },
  {
    info: {
      id: branchID++,
      name: "React Query",
      path: "react-query",
    },
  },
];
