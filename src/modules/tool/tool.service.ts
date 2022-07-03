import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { isIPv4, isIPv6 } from 'net';
import { HttpService } from '~/processors/helper/helper.http.service'
import { IP } from './tool.interface';
import camelcaseKeys from 'camelcase-keys'

@Injectable()
export class ToolService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async getIp(ip: string, timeout = 3000): Promise<IP> {
    const isV4 = isIPv4(ip)
    const isV6 = isIPv6(ip)
    if (!isV4 && !isV6) {
      throw new UnprocessableEntityException('Invalid IP')
    }

    if (isV4) {
      const { data } = await this.httpService.axiosRef.get(
        `https://api.i-meto.com/ip/v1/qqwry/${ip}`,
        {
          timeout,
        },
      )

      return camelcaseKeys(data, { deep: true }) as IP
    } else {
      const { data } = (await this.httpService.axiosRef.get(
        `http://ip-api.com/json/${ip}`,
        {
          timeout,
        },
      )) as any

      const res = {
        cityName: data.city,
        countryName: data.country,
        ip: data.query,
        ispDomain: data.as,
        ownerDomain: data.org,
        regionName: data.region_name,
      } as const

      return res
    }
  }
}
