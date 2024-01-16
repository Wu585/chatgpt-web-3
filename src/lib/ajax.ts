import axios, {AxiosError, AxiosRequestConfig} from "axios";

export const ajax = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 1000000
})

ajax.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token") || ""
  config.headers = config.headers || {}
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
})

ajax.interceptors.response.use((response) => {
  if (response.data instanceof Blob) {
    return response
  }
  return response.data
})

export const useAjax = () => {

  const onError = (error: AxiosError) => {
    if (error?.response?.status === 401) {
      window.location.href = "#/sign-in"
    }
    throw error
  }

  return {
    get: <T>(path: string, config?: AxiosRequestConfig<any>) => {
      return ajax.get<T>(path, config).catch(onError)
    },
    post: <T>(path: string, data: JSONValue, config?: AxiosRequestConfig<any>) => {
      return ajax.post<T>(path, data, config).catch(onError)
    },
    patch: <T>(path: string, data: JSONValue) => {
      return ajax.patch<T>(path, data).catch(onError)
    },
    destroy: <T>(path: string) => {
      return ajax.delete<T>(path).catch(onError)
    },
  }
}
