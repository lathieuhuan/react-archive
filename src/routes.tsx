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

export interface IBranch {
  name: string;
  path: string;
  branches?: IBranch[];
}

export const branches: IBranch[] = [
  {
    name: "React Hook Form",
    path: "react-hook-form",
    branches: [
      {
        name: "Basic",
        path: "basic",
        branches: [
          {
            name: "Plain Values with Register Options",
            path: "plain-values-with-register-options"
          },
          {
            name: "Nested Values with Yup Validation",
            path: "nested-values-with-yup-validation"
          }
        ]
      }
    ]
  },
  {
    name: "React Query",
    path: "react-query",
  },
];
