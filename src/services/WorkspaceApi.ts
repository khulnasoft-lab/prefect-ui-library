import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'

type PrefectConfig = {
  baseUrl: string,
}

type CloudConfig = {
  baseUrl: string,
  accountId: string,
  workspaceId: string,
  token: string,
}

function isCloudConfig(config: WorkspaceApiConfig): config is CloudConfig {
  return 'accountId' in config && 'workspaceId' in config && 'token' in config
}

export type WorkspaceApiConfig = PrefectConfig | CloudConfig

export class WorkspaceApi {

  private readonly workspaceConfig: WorkspaceApiConfig

  protected prefix: string = ''

  public constructor(workspaceConfig: WorkspaceApiConfig) {
    this.workspaceConfig = workspaceConfig
  }

  private get config(): AxiosRequestConfig {
    return {
      baseURL: this.baseUrl,
      headers: this.headers,
    }
  }

  private get baseUrl(): string {
    const { baseUrl } = this.workspaceConfig

    const base = `${baseUrl}${this.prefix}`

    if (isCloudConfig(this.workspaceConfig)) {
      const { accountId, workspaceId } = this.workspaceConfig

      return `${base}/accounts/${accountId}/workspaces/${workspaceId}`
    }

    return base
  }

  private get headers(): AxiosRequestHeaders {
    const headers: AxiosRequestHeaders = {}

    if (isCloudConfig(this.workspaceConfig)) {
      const { token } = this.workspaceConfig

      headers.Authorization = `bearer ${token}`
    }

    return headers
  }

  protected get instance(): AxiosInstance {
    return axios.create(this.config)
  }

  protected get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.get(url, config)
  }

  protected delete<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.delete(url, config)
  }

  protected head<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.head(url, config)
  }

  protected options<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.options(url, config)
  }

  // axios uses any for the data argument
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected post<T, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.post(url, data, config)
  }

  // axios uses any for the data argument
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected put<T, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.put(url, data, config)
  }

  // axios uses any for the data argument
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected patch<T, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.patch(url, data, config)
  }
}