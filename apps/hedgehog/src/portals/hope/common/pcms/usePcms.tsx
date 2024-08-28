import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as React from 'react'
import { Locales } from '@hope/features/config/constants'

export interface CommonClaim {
  id: number
  attributes: {
    title: string
    locale: string
    type: string
  }
  locale: Locales
}

const PcmsContext = createContext<{
  allCommonClaims: CommonClaim[]
  getCommonClaim: (commonClaimId: number) => CommonClaim | undefined
}>({
  allCommonClaims: [],
  getCommonClaim: () => undefined,
})

export const usePcms = () => useContext(PcmsContext)

export const PcmsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [allCommonClaims, setAllCommonClaims] = useState<CommonClaim[]>([])
  const getCommonClaims = async (locale: string): Promise<CommonClaim[]> => {
    return (
      await fetch(
        `https://promise-cms.dev.hedvigit.com/public/common-claims?locale=${locale}&populate=*`,
      )
        .then((res) => res.json())
        .catch((error) => console.error(error))
    )?.data as CommonClaim[]
  }

  const getAllCommonClaims = useCallback(async () => {
    return Promise.all(
      Object.values(Locales).map((locale) => getCommonClaims(locale)),
    ).then((commonClaimLists) => {
      return commonClaimLists.flat().sort((a, b) => +a.id - +b.id)
    })
  }, [])

  useEffect(() => {
    getAllCommonClaims().then((all) => setAllCommonClaims(all))
  }, [getAllCommonClaims])

  const getCommonClaim = (commonClaimId: number) =>
    allCommonClaims.find((commonClaim) => commonClaim.id === commonClaimId)

  return (
    <PcmsContext.Provider value={{ allCommonClaims, getCommonClaim }}>
      {children}
    </PcmsContext.Provider>
  )
}
