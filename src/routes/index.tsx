import { QueryClient, QueryClientProvider } from "react-query";

import Axios from "@Features/axios";
import AxiosBasic from "@Features/axios/Basic";
import Intermediate from "@Features/axios/Intermediate";

import ReactHookForm from "@Features/react-hook-form";
import BasicForms from "@Features/react-hook-form/basic";
import PlainValues from "@Features/react-hook-form/basic/PlainValues";
import RHFNestedValues from "@Features/react-hook-form/basic/NestedValues";
import IntermediateForms from "@Features/react-hook-form/intermediate/";
import UseController from "@Features/react-hook-form/intermediate/UseController";

import ReactQuery from "@Features/react-query";

import Tricks from "@Features/tricks";
import AutoResizeInput from "@Features/tricks/AutoResizeInput";
import TableWithAfter from "@Features/tricks/TableWithAfter";

import Processors from "@Features/processors";
import InputProcessors from "@Features/processors/InputProcessors";
import InputNumber from "@Src/features/processors/InputProcessors/InputNumber";
import UseInputNumber from "@Src/features/processors/InputProcessors/UseInputNumber";

import Formik from "@Features/formik";
import BasicFormik from "@Features/formik/basic";
import FormikNestedValues from "@Features/formik/basic/NestedValues";

import { ICluster } from "./types";
import I18next from "@Src/features/i18next";

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
      name: "Formik",
      path: "formik",
    },
    component: Formik,
    cluster: [
      {
        info: {
          id: branchID++,
          name: "Basic",
          path: "basic",
        },
        component: BasicFormik,
        cluster: [
          {
            info: {
              id: branchID++,
              name: "Nested values",
              path: "nested-values",
            },
            component: FormikNestedValues,
          },
        ],
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
            component: RHFNestedValues,
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
              name: "Input Number",
              path: "input-number",
            },
            component: InputNumber,
          },
          {
            info: {
              id: branchID++,
              name: "useInputNumber",
              path: "useInputNumber-example",
            },
            component: UseInputNumber,
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
      {
        info: {
          id: branchID++,
          name: "Table with ::after",
          path: "table-with-after",
        },
        component: TableWithAfter,
      },
    ],
  },
];
