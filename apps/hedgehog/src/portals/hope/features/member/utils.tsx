import { getBirthdayInfo, getBirthDayText } from '@hedvig-ui'
import { differenceInYears, parse } from 'date-fns'
import {
  Market,
  MarketFlags,
  PickedLocale,
  PickedLocaleMarket,
} from '@hope/features/config/constants'
import * as React from 'react'
import { ContractMarketInfo } from 'types/generated/graphql'

export const MemberAge: React.FC<{
  birthDateString: string
}> = ({ birthDateString }) => {
  if (!birthDateString) {
    return null
  }
  let birthDate
  try {
    birthDate = parse(birthDateString, 'yyyy-MM-dd', new Date())
  } catch (e) {
    return null
  }
  const age = differenceInYears(new Date(), birthDate)

  return (
    <>
      {age} years
      {getBirthdayInfo(birthDateString) && (
        <> - {getBirthDayText(birthDateString)}</>
      )}
    </>
  )
}

export const getMemberFlag = (
  contractMarketInfo?: {
    market?: ContractMarketInfo['market']
  } | null,
  pickedLocale: PickedLocale | null = null,
): React.ReactNode => {
  if (contractMarketInfo?.market) {
    return MarketFlags[contractMarketInfo.market as Market]
  }

  if (!pickedLocale) {
    return '🏳'
  }

  const market = PickedLocaleMarket[pickedLocale]

  if (!market) {
    return '🏳'
  }

  return `${MarketFlags[market]} & 🏳`
}
