import { InfoContainer, Input, Spacing, ThirdLevelHeadline } from '@hedvig-ui'
import { PartnerDropdown } from '@hope/features/tools/campaign-codes/forms/PartnerDropdown'
import * as React from 'react'
import { CampaignFilter } from 'types/generated/graphql'

export const CampaignCodeFilter: React.FC<{
  filter: CampaignFilter
  setFilter: React.Dispatch<React.SetStateAction<CampaignFilter>>
}> = ({ filter, setFilter }) => {
  return (
    <InfoContainer>
      <ThirdLevelHeadline>Filter Codes</ThirdLevelHeadline>
      <Input
        value={filter.code ?? ''}
        onChange={({ currentTarget: { value: code } }) => {
          setFilter({
            ...filter,
            code,
          })
        }}
        placeholder="Code"
      />
      <Spacing top="small" />
      <PartnerDropdown
        onChange={(data) =>
          setFilter({
            ...filter,
            partnerId: data ? (data.value as string) : null,
          })
        }
        value={filter.partnerId ?? ''}
        placeholder="Partner name"
      />
      <Spacing top="small" />
    </InfoContainer>
  )
}
