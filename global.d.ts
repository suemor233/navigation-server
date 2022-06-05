import { Consola } from 'consola'



declare global {
  export type KV<T = any> = Record<string, T>
  export const consola: Consola

}

export {}
