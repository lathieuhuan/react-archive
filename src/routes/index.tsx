import { QueryClient, QueryClientProvider } from "react-query";
import type { ICluster } from "./types";

import Axios, { Basic as AxiosBasic, Intermediate } from "@Features/axios";
import { PlainValues, NestedValues, UseController } from "@Features/react-hook-form";
import ReactQuery from "@Features/react-query";
import { AutoResizeInput, TableWithAfter, HorizontalList } from "@Features/tricks";
import { InputNumberExample, UseInputNumberExamples, BarcodeScanner } from "@Features/processors";
import { I18next } from "@Features/i18next";
import DynamicTypeForm from "@Features/dynamic-type-form";

let branchID = 1;
const queryClient = new QueryClient();

export const topCluster: ICluster = [
  {
    info: {
      id: branchID++,
      name: "React i18next",
      path: "i18next",
    },
    component: I18next,
  },
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
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Input Processors",
          path: "input-processors",
        },
        cluster: [
          {
            info: {
              id: branchID++,
              name: "Input Number",
              path: "input-number",
            },
            component: InputNumberExample,
          },
          {
            info: {
              id: branchID++,
              name: "useInputNumber",
              path: "useInputNumber-example",
            },
            component: UseInputNumberExamples,
          },
        ],
      },
      {
        info: {
          id: branchID++,
          name: "Barcode Scanner",
          path: "barcode-scanner",
        },
        component: BarcodeScanner,
      },
    ],
  },
  {
    info: {
      id: branchID++,
      name: "Dynamic Type Form",
      path: "dynamic-type-form",
    },
    component: DynamicTypeForm,
  },
  {
    info: {
      id: branchID++,
      name: "Tricks",
      path: "tricks",
    },
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Auto-resize Input",
          path: "auto-resize-input",
        },
        component: AutoResizeInput,
      },
      {
        info: {
          id: branchID++,
          name: "Table with ::after",
          path: "table-with-after",
        },
        component: TableWithAfter,
      },
      {
        info: {
          id: branchID++,
          name: "Horizontal List",
          path: "horizontal-list",
        },
        component: HorizontalList,
      },
    ],
  },
];
