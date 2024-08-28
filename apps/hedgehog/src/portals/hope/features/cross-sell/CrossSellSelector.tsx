import * as React from 'react'
import { useContracts } from '@hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import {
  ContractIcon,
  ContractMarketTypes,
  InsuranceType,
  Market,
} from '@hope/features/config/constants'
import { convertEnumToTitle } from '@hedvig-ui'
import { useGetMemberPickedLocaleAndMarketQuery } from 'types/generated/graphql'
import { PopupMenuItem } from '@hedvig-ui/redesign'

const ContractCrossSell = {
  sv_SE: {
    [InsuranceType.SwedishAccident]: 'se/forsakringar/olycksfallsforsakring',
    [InsuranceType.SwedishCar]: 'se/forsakringar/bilforsakring',
    [InsuranceType.SwedishCat]: 'se/forsakringar/kattforsakring',
    [InsuranceType.SwedishDog]: 'se/forsakringar/hundforsakring',
  },
  en_SE: {
    [InsuranceType.SwedishAccident]: 'se-en/insurances/accident',
    [InsuranceType.SwedishCar]: 'se-en/insurances/car-insurance',
    [InsuranceType.SwedishCat]: 'se-en/insurances/cat-insurance',
    [InsuranceType.SwedishDog]: 'se-en/insurances/dog-insurance',
  },
}

type AllowedInsuranceType = keyof (typeof ContractCrossSell)['sv_SE']

export const CrossSellSelector: React.FC<{
  memberId: string
  onSelect: (link: string) => void
}> = ({ memberId, onSelect }) => {
  const [contracts, { loading }] = useContracts(memberId)

  const { data: memberData } = useGetMemberPickedLocaleAndMarketQuery({
    variables: { memberId },
    fetchPolicy: 'cache-first',
  })
  const pickedLocale = (memberData?.member?.pickedLocale ?? 'sv_SE') as
    | 'sv_SE'
    | 'en_SE'

  if (contracts.length === 0) return null

  const market = contracts[0].market

  if (market !== Market.Sweden) return 'Not supported'

  if (loading) return null

  const insuranceTypes = ContractMarketTypes[market as Market]
    .filter((insuranceType) =>
      Object.keys(ContractCrossSell[pickedLocale]).includes(insuranceType),
    )
    .filter((insuranceType) =>
      contracts.some((contract) => contract.insuranceType !== insuranceType),
    )

  return (
    <div>
      {insuranceTypes.map((insuranceType) => {
        const path =
          ContractCrossSell[pickedLocale][insuranceType as AllowedInsuranceType]
        const url = `${process.env.NEXT_PUBLIC_HEDVIG_COM}/api/redirect/recommend?initiated_from=CROSS_SELL&attributed_to=IEX&next=/${path}`
        return (
          <PopupMenuItem
            key={insuranceType}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(url)
            }}
          >
            {convertEnumToTitle(
              insuranceType.substring(insuranceType.indexOf('_')),
            )}
            <span>{ContractIcon[insuranceType]}</span>
          </PopupMenuItem>
        )
      })}
    </div>
  )
}
