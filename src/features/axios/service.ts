import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "./constant";

// Axios global
// axios.defaults.headers.common.Authorization = "Bearer ...";

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
  axiosInterceptorInstance.interceptors.response.use((response) => {
    console.log(response);
    return response;
  })
  return axiosInterceptorInstance(args);
}
