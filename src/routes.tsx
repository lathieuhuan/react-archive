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
