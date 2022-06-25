import { QueryClient, QueryClientProvider } from "react-query";
import { ICluster } from "./types";

import ReactHookForm from "../react-hook-form";
import BasicForms from "../react-hook-form/basic";
import PlainValues from "../react-hook-form/basic/PlainValues";
import NestedValues from "../react-hook-form/basic/NestedValues";
import ReactQuery from "../react-query";

let branchID = 0;
const queryClient = new QueryClient();

export const topCluster: ICluster = [
  {
    info: {
      id: branchID++,
      name: "React Hook Form",
      path: "react-hook-form",
    },
    component: ReactHookForm,
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Basic",
          path: "basic",
        },
        component: BasicForms,
        cluster: [
          {
            info: {
              id: branchID++,
              name: "Plain Values with Register Options",
              path: "plain-values-with-register-options",
            },
            component: PlainValues,
          },
          {
            info: {
              id: branchID++,
              name: "Nested Values with Yup Validation",
              path: "nested-values-with-yup-validation",
            },
            component: NestedValues,
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
    component: () => (
      <QueryClientProvider client={queryClient}>
        <ReactQuery />
      </QueryClientProvider>
    ),
  },
];
