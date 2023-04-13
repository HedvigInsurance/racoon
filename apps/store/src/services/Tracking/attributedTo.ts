import { NextRouter } from 'next/router'
import { isBrowser } from '@/utils/env'

const PARAM_NAME = 'attributed_to'

export const getAttributedToQueryParam = (): string | null => {
  if (!isBrowser()) return null
  return new URL(window.location.href).searchParams.get(PARAM_NAME)
}

export const removeAttributedToQueryParam = (router: NextRouter) => {
  if (router.query[PARAM_NAME]) {
    const target = { pathname: router.pathname, query: { ...router.query } }
    delete target.query[PARAM_NAME]
    router.replace(target, undefined, { shallow: true })
  }
}
