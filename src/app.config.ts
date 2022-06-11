export const PORT = process.env.PORT || 2346
export const API_VERSION = 2
import {  isDev,  } from './global/env.global'
export const CROSS_DOMAIN = {
  allowedOrigins: [
    'suemor.com',
    'localhost',
    '127.0.0.1',
    '.*dev',
  ],
}


export const MONGO_DB = {
  dbName: 'navigation',
  host: 'localhost',
  port: 27017,
  get uri() {
    return `mongodb://${this.host}:${this.port}/${this.dbName}`
  },
}

export const REDIS = {
  host:  'localhost',
  port:  6379,
  password: null,
  ttl: null,
  httpCacheTTL: 5,
  max: 5,
  disableApiCache:
    isDev && !process.env['ENABLE_CACHE_DEBUG'],
}

export const AXIOS_CONFIG = {
  timeout: 10000,
}

export const SECURITY = {
  jwtSecret: 'suemor',
  jwtExpire: '7d',
}



