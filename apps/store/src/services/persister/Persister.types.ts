import { OptionsType } from 'cookies-next/lib/types'

export interface SimplePersister {
  save(value: string, key?: string, options?: OptionsType): void

  fetch(key?: string): string | null

  reset(key?: string): void
}
