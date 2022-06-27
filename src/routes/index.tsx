import { QueryClient, QueryClientProvider } from "react-query";

import Axios from "../features/axios";
import AxiosBasic from "../features/axios/Basic";
import Intermediate from "../features/axios/Intermediate";
import ReactHookForm from "../features/react-hook-form";
import BasicForms from "../features/react-hook-form/basic";
import PlainValues from "../features/react-hook-form/basic/PlainValues";
import NestedValues from "../features/react-hook-form/basic/NestedValues";
import ReactQuery from "../features/react-query";

import { ICluster } from "./types";

let branchID = 1;
const queryClient = new QueryClient();

export const topCluster: ICluster = [
  {
    info: {
      id: branchID++,
      name: "Axios",
      path: "axios",
    },
    component: Axios,
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Basic",
          path: "basic",
        },
        component: AxiosBasic,
      },
      {
        info: {
          id: branchID++,
          name: "Intermediate",
          path: "intermediate",
        },
        component: Intermediate,
      },
    ],
  },
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
              name: "Plain values",
              path: "plain-values",
            },
            component: PlainValues,
          },
          {
            info: {
              id: branchID++,
              name: "Nested values",
              path: "nested-values",
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
