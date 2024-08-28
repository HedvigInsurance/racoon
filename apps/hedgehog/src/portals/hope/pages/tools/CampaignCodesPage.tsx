import styled from '@emotion/styled'
import { Card, CardsWrapper, MainHeadline, Spacing } from '@hedvig-ui'
import { CampaignCodeFilter } from '@hope/features/tools/campaign-codes/components/CampaignCodeFilter'
import { CampaignCodeTable } from '@hope/features/tools/campaign-codes/components/CampaignCodeTable'
import { CreateCampaignCode } from '@hope/features/tools/campaign-codes/components/CreateCampaignCode'
import { initialCampaignFilter } from '@hope/features/tools/campaign-codes/utils'
import * as React from 'react'
import { CampaignFilter } from 'types/generated/graphql'

const Wrapper = styled.div`
  padding: 2rem;
`

const CampaignCodesPage: React.FC = () => {
  const [campaignFilter, setCampaignFilter] = React.useState<CampaignFilter>(
    initialCampaignFilter,
  )

  return (
    <Wrapper>
      <MainHeadline>Campaign Codes</MainHeadline>
      <Spacing top />
      <CardsWrapper>
        <Card span={2}>
          <CampaignCodeFilter
            filter={campaignFilter}
            setFilter={setCampaignFilter}
          />
        </Card>
        <Card span={2}>
          <CreateCampaignCode />
        </Card>
        <CampaignCodeTable filter={campaignFilter} />
      </CardsWrapper>
    </Wrapper>
  )
}

export default CampaignCodesPage
