import styled from '@emotion/styled'
import {
  Button,
  Capitalized,
  Monetary,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  convertCamelcaseToTitle,
  Popover,
  Flex,
  InfoTag,
  convertEnumToTitle,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { format } from 'date-fns'
import * as React from 'react'
import {
  isCostDeduction,
  isFreeMonths,
  isIndefinitePercentageDiscount,
  isMonthlyPercentageDiscountFixedPeriod,
} from '@hope/features/tools/campaign-codes/utils'
import {
  GetReferralInformationDocument,
  RedeemedCampaign,
  RedemptionState,
  useManualUnRedeemCampaignMutation,
} from 'types/generated/graphql'

const TableContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0.5rem;
  }
`

const incentiveData = (incentive: RedeemedCampaign['incentive']) => {
  if (isCostDeduction(incentive)) {
    return incentive?.amount ? <Monetary amount={incentive.amount} /> : null
  }
  if (isFreeMonths(incentive)) {
    return incentive?.numberOfMonths
      ? incentive.numberOfMonths + ' free months'
      : null
  }
  if (isIndefinitePercentageDiscount(incentive)) {
    return incentive?.percentageDiscount
      ? incentive.percentageDiscount + '%'
      : null
  }
  if (isMonthlyPercentageDiscountFixedPeriod(incentive)) {
    return incentive?.numberOfMonths && incentive?.percentage
      ? incentive.numberOfMonths +
          ' months with ' +
          incentive.percentage +
          '% discount'
      : null
  }
  return null
}

const incentiveEnd = (
  incentive: RedeemedCampaign['incentive'],
  activatedAt: RedemptionState['activatedAt'],
) => {
  if (!activatedAt) {
    return null
  }
  const activationDate = new Date(activatedAt)
  if (
    isFreeMonths(incentive) ||
    isMonthlyPercentageDiscountFixedPeriod(incentive)
  ) {
    return incentive?.numberOfMonths
      ? format(
          new Date(
            activationDate.setMonth(
              activationDate.getMonth() + incentive.numberOfMonths,
            ),
          ),
          'yyyy-MM-dd',
        )
      : null
  }

  return null
}

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 'SWEDISH DANISH NORWEGIAN';
`

export const CampaignsRedeemedTable: React.FC<{
  memberId: string
  campaignsRedeemed: RedeemedCampaign[]
}> = ({ memberId, campaignsRedeemed }) => {
  const [manualUnRedeemCampaign, { loading }] =
    useManualUnRedeemCampaignMutation()
  const { confirm } = useConfirmDialog()

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableHeaderColumn>Code</TableHeaderColumn>
          <TableHeaderColumn>Type</TableHeaderColumn>
          <TableHeaderColumn>Incentive</TableHeaderColumn>
          <TableHeaderColumn>Activated</TableHeaderColumn>
          <TableHeaderColumn>Ends</TableHeaderColumn>
          <TableHeaderColumn>Redeemed</TableHeaderColumn>
          <TableHeaderColumn>Active to</TableHeaderColumn>
          <TableHeaderColumn />
        </TableHeader>

        <TableBody>
          {campaignsRedeemed.map((campaign, index) => {
            const incentive = incentiveData(campaign.incentive)
            const insuranceTypesByCountry =
              campaign.voucherCampaignData?.insuranceTypes.reduce(
                (acc, insuranceType) => {
                  const country = insuranceType.split('_')[0]
                  const insurance = insuranceType.split('_').slice(1).join('_')
                  if (acc[country]) {
                    acc[country].push(insurance)
                  } else {
                    acc[country] = [insurance]
                  }
                  return acc
                },
                {} as Record<string, string[]>,
              ) ?? {}
            return (
              !campaign.redemptionState.unRedeemedAt && (
                <TableRow border key={`${campaign.code}-${index}`}>
                  <TableColumn>{campaign.code.toUpperCase()}</TableColumn>
                  <TableColumn>
                    <Flex direction="column" gap="fraction">
                      <Capitalized>{campaign.type}</Capitalized>
                      {!!campaign.voucherCampaignData && (
                        <InfoTag status="info">
                          {campaign.voucherCampaignData.partnerName}
                        </InfoTag>
                      )}
                    </Flex>
                  </TableColumn>
                  <TableColumn>
                    <Flex
                      direction="column"
                      gap="fraction"
                      style={{ width: '100%' }}
                    >
                      <Popover
                        position="right"
                        contents={
                          incentive
                            ? convertCamelcaseToTitle(
                                campaign.incentive.__typename ?? '',
                              )
                            : null
                        }
                      >
                        {incentive
                          ? incentive
                          : convertCamelcaseToTitle(
                              campaign.incentive.__typename ?? '',
                            )}
                      </Popover>

                      <ThreeColumnGrid>
                        {Object.entries(insuranceTypesByCountry).map(
                          ([country, insuranceTypes]) => (
                            <div key={country} style={{ gridArea: country }}>
                              <InfoTag status="highlight">
                                {convertEnumToTitle(country)}
                              </InfoTag>
                              {insuranceTypes
                                .sort((a, b) => (a < b ? -1 : 1))
                                .map((insuranceType) => (
                                  <InfoTag
                                    key={insuranceType}
                                    status="info"
                                    style={{ marginTop: '4px' }}
                                  >
                                    {convertEnumToTitle(insuranceType)}
                                  </InfoTag>
                                ))}
                            </div>
                          ),
                        )}
                      </ThreeColumnGrid>
                    </Flex>
                  </TableColumn>
                  <TableColumn>
                    {campaign.redemptionState.activatedAt &&
                      format(
                        new Date(campaign.redemptionState.activatedAt),
                        'yyyy-MM-dd',
                      )}
                  </TableColumn>
                  <TableColumn>
                    {incentiveEnd(
                      campaign.incentive,
                      campaign.redemptionState.activatedAt,
                    )}
                  </TableColumn>
                  <TableColumn>
                    {format(
                      new Date(campaign.redemptionState.redeemedAt),
                      'yyyy-MM-dd',
                    )}
                  </TableColumn>
                  <TableColumn>
                    {campaign.redemptionState.activeTo &&
                      format(
                        new Date(campaign.redemptionState.activeTo),
                        'yyyy-MM-dd',
                      )}
                  </TableColumn>
                  <TableColumn>
                    <Button
                      disabled={loading}
                      onClick={() => {
                        confirm(
                          `Are you sure you want to unredeem the campaign ${campaign.code.toUpperCase()}?`,
                        ).then(() => {
                          manualUnRedeemCampaign({
                            variables: {
                              memberId,
                              request: { campaignCode: campaign.code },
                            },
                            refetchQueries: [
                              { query: GetReferralInformationDocument },
                            ],
                          })
                        })
                      }}
                    >
                      Unredeem
                    </Button>
                  </TableColumn>
                </TableRow>
              )
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
