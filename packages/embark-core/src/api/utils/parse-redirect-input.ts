import { Redirect } from '@/shared/types'
import { Store } from '../types'

export const parseRedirectInput = (redirect: Redirect): Store => {
  if (redirect.key) return { [redirect.key]: redirect.value }
  return {}
}
