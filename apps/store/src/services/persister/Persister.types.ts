import { OptionsType, TmpCookiesObj } from 'cookies-next/lib/types'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface SimplePersister {
  save(value: string, key?: string, options?: OptionsType): void

  fetch(key?: string): string | null

  reset(key?: string): void

  getAll(): TmpCookiesObj
}
