import axios, {AxiosRequestConfig} from "axios";

export const ajax = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

ajax.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token") || ""
  config.headers = config.headers || {}
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
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
