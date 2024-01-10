import axios, {AxiosRequestConfig} from "axios";

export const ajax = axios.create({
  baseURL:"/api",
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export const useAjax = () => {
  return {
    get: <T>(path: string, config?: AxiosRequestConfig<any>) => {
      return ajax.get<T>(path, config)
    },
    post: <T>(path: string, data: JSONValue) => {
      return ajax.post<T>(path, data)
    },
    patch: <T>(path: string, data: JSONValue) => {
      return ajax.patch<T>(path, data)
    },
    destroy: <T>(path: string) => {
      return ajax.delete<T>(path)
    },
  }
}
