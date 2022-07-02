import { QueryClient, QueryClientProvider } from "react-query";

import Axios from "../features/axios";
import AxiosBasic from "../features/axios/Basic";
import Intermediate from "../features/axios/Intermediate";

import ReactHookForm from "../features/react-hook-form";
import BasicForms from "../features/react-hook-form/basic";
import PlainValues from "../features/react-hook-form/basic/PlainValues";
import NestedValues from "../features/react-hook-form/basic/NestedValues";
import IntermediateForms from "../features/react-hook-form/intermediate/";
import UseController from "../features/react-hook-form/intermediate/UseController";

import ReactQuery from "../features/react-query";

import Tricks from "../features/tricks";
import AutoResizeInput from "../features/tricks/AutoResizeInput";

import Processors from "../features/processors";
import InputProcessors from "../features/processors/InputProcessors";
import FormatAndLimitNumber from "../features/processors/InputProcessors/FormatAndLimitNumber";

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
      {
        info: {
          id: branchID++,
          name: "Intermediate",
          path: "intermediate",
        },
        component: IntermediateForms,
        cluster: [
          {
            info: {
              id: branchID++,
              name: "Use Controller",
              path: "use-controller",
            },
            component: UseController,
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
  {
    info: {
      id: branchID++,
      name: "Processors",
      path: "processors",
    },
    component: Processors,
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Input Processors",
          path: "input-processors",
        },
        component: InputProcessors,
        cluster: [
          {
            info: {
              id: branchID++,
              name: "Format and Limit Number",
              path: "format-and-limit-number",
            },
            component: FormatAndLimitNumber,
          },
        ],
      },
    ],
  },
  {
    info: {
      id: branchID++,
      name: "Tricks",
      path: "tricks",
    },
    component: Tricks,
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Auto-resize Input",
          path: "auto-resize-input",
        },
        component: AutoResizeInput,
      },
    ],
  },
];
