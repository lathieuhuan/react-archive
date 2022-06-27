import axios from "axios";
import { BASE_URL } from "./constant";
import { FetchMethod } from "./types";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export interface ServiceArgs<T = any, D = any> {
  method: FetchMethod;
  url: string;
  data?: T;
  params?: D;
}
export function axiosService<T = any, D = any>(
  args: ServiceArgs<T, D>
) {
  return axiosInstance(args);
}
