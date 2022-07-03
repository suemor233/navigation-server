import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import retryAxios from 'axios-retry'
import { inspect } from 'util'
import { Global, Injectable, Logger } from '@nestjs/common'
import { AXIOS_CONFIG } from '~/app.config'
import { version } from '../../../package.json'

declare module 'axios' {
  interface AxiosRequestConfig {
    __requestStartedAt?: number
    __requestEndedAt?: number
    __requestDuration?: number
    __debugLogger?: boolean
  }
}

@Injectable()
export class HttpService {
  private http: AxiosInstance
  private logger: Logger
  constructor() {
    this.logger = new Logger(HttpService.name)

    this.http = this.bindInterceptors(
      axios.create({
        ...AXIOS_CONFIG,
        headers: {
          'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 MX-Space/${version}`,
        },
      }),
    )
    retryAxios(this.http, {
      retries: 3,
      retryDelay: (count) => {
        return 1000 * count
      },
      shouldResetTimeout: true,
    })
  }

  private bindDebugVerboseInterceptor($http: AxiosInstance) {

    return $http
  }

  private bindInterceptors($http: AxiosInstance) {
    this.bindDebugVerboseInterceptor($http)
    return $http
  }
  private prettyStringify(data: any) {
    return inspect(data, { colors: true })
  }



  public get axiosRef() {
    return this.http
  }



}
