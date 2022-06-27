import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "./constant";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export function axiosServiceWithInterceptor(args: AxiosRequestConfig) {
  const axiosInterceptorInstance = axios.create({
    baseURL: BASE_URL,
  });
  axiosInterceptorInstance.interceptors.request.use((config) => {
    console.log(config);
    return config;
  }, Promise.reject);
  return axiosInterceptorInstance(args);
}
