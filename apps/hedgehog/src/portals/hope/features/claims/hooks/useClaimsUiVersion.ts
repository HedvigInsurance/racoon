import { useLocalStorage } from '@hedvig-ui'
import { useCallback } from 'react'

export enum ClaimsUiVersion {
  NEW = 'NEW',
  OLD = 'OLD',
}

const storageKey = 'claims_ui_version'

export const useClaimsUiVersion = () => {
  const [version, setVersion] = useLocalStorage(storageKey, ClaimsUiVersion.NEW)

  const toggle = useCallback(() => {
    if (version === ClaimsUiVersion.NEW) {
      setVersion(ClaimsUiVersion.OLD)
    }
    if (version === ClaimsUiVersion.OLD) {
      setVersion(ClaimsUiVersion.NEW)
    }
  }, [setVersion, version])

  return [version, setVersion, toggle] as const
}
