import styled from '@emotion/styled'
import {
  Card,
  Flex,
  InfoTag,
  Label,
  LoadingMessage,
  SearchableDropdown,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TextDatePicker,
  convertEnumToTitle,
} from '@hedvig-ui'
import { useTitle } from '@hedvig-ui'
import { usePartnerCampaigns } from '@hope/features/tools/campaign-codes/hooks/use-partner-campaigns'
import { usePartnerCampaignOwners } from '@hope/features/tools/campaign-codes/hooks/use-get-partner-campaign-owners'
import {
  formatValidity,
  useGetCodeTypeOptions,
  getDiscountDetails,
  getIncentiveText,
  mapCampaignOwners,
} from '@hope/features/tools/campaign-codes/utils'
import { FC, useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  CampaignFilter,
  useSetCampaignCodeTypeMutation,
  useSetCampaignOwnerMutation,
  useSetCampaignValidFromMutation,
  useSetCampaignValidUntilMutation,
  VoucherCampaign,
} from 'types/generated/graphql'
import { css } from '@emotion/react'
import { PencilFill } from 'react-bootstrap-icons'
import { Keys } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import gql from 'graphql-tag'

const CenteredCell = styled(TableColumn)<{ editable?: boolean }>`
  padding: 0;

  ${({ editable }) =>
    editable &&
    css`
      > div {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;

        .edit-icon {
          opacity: 0;
          margin-left: 1rem;
        }

        :hover {
          .edit-icon {
            opacity: 1;
            margin-left: 1rem;
          }
        }
      }
    `};
`

gql`
  mutation SetCampaignValidFrom($id: ID!, $validFrom: Instant!) {
    setCampaignValidFrom(id: $id, validFrom: $validFrom) {
      id
      validFrom
    }
  }

  mutation SetCampaignValidUntil($id: ID!, $validUntil: Instant!) {
    setCampaignValidUntil(id: $id, validUntil: $validUntil) {
      id
      validTo
    }
  }
`

const CampaignValidityCell: FC<{
  campaign: VoucherCampaign
  defaultValidFrom?: string
  defaultValidUntil?: string
}> = ({ campaign, defaultValidFrom, defaultValidUntil }) => {
  const [setCampaignValidFrom] = useSetCampaignValidFromMutation()
  const [setCampaignValidUntil] = useSetCampaignValidUntilMutation()
  const { confirm } = useConfirmDialog()
  const [validFrom, setValidFrom] = useState<string | null>(
    defaultValidFrom ?? null,
  )
  const [validUntil, setValidUntil] = useState<string | null>(
    defaultValidUntil ?? null,
  )
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <div onClick={() => setEditing(true)}>
        {formatValidity(validFrom, validUntil)}
        <PencilFill className="edit-icon" />
      </div>
    )
  }

  return (
    <div>
      <Flex>
        <Flex direction="row" style={{ padding: '1rem 0' }}>
          <div>
            <Label>Valid from</Label>
            <TextDatePicker
              withCurrentTime
              value={validFrom}
              placeholder="Beginning of time"
              onChange={(date, event) => {
                event?.preventDefault()
                confirm(
                  date
                    ? `Are you sure you want to change the campaign's start-date to ${date}?`
                    : `Are you sure you want to remove the start-date?`,
                ).then(() => {
                  toast.promise(
                    setCampaignValidFrom({
                      variables: {
                        id: campaign.id,
                        validFrom: date,
                      },
                      optimisticResponse: {
                        setCampaignValidFrom: {
                          id: campaign.id,
                          validFrom: date,
                        },
                      },
                    }),
                    {
                      loading: 'Updating validity',
                      success: () => {
                        setEditing(false)
                        setValidFrom(date?.split('T')[0] ?? null)
                        return 'Validity updated'
                      },
                      error: 'Could not update validity',
                    },
                  )
                })
              }}
              onKeyDown={(e) => {
                if (e.key === Keys.Escape.code) {
                  setEditing(false)
                  setValidFrom(defaultValidFrom ?? null)
                  setValidUntil(defaultValidUntil ?? null)
                }
              }}
            />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <Label>Valid to</Label>
            <TextDatePicker
              withCurrentTime
              value={validUntil}
              placeholder="End of time"
              onChange={(date, event) => {
                event?.preventDefault()
                confirm(
                  date
                    ? `Are you sure you want to change the campaign's end-date to ${date}?`
                    : `Are you sure you want to remove the end-date?`,
                ).then(() => {
                  toast.promise(
                    setCampaignValidUntil({
                      variables: {
                        id: campaign.id,
                        validUntil: date,
                      },
                      optimisticResponse: {
                        setCampaignValidUntil: {
                          id: campaign.id,
                          validTo: date,
                        },
                      },
                    }),
                    {
                      loading: 'Updating validity',
                      success: () => {
                        setEditing(false)
                        setValidUntil(date?.split('T')[0] ?? null)
                        return 'Validity updated'
                      },
                      error: 'Could not update validity',
                    },
                  )
                })
              }}
              onKeyDown={(e) => {
                if (e.key === Keys.Escape.code) {
                  setEditing(false)
                  setValidFrom(defaultValidFrom ?? null)
                  setValidUntil(defaultValidUntil ?? null)
                }
              }}
            />
          </div>
        </Flex>
      </Flex>
    </div>
  )
}

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 'SWEDISH DANISH NORWEGIAN';
`

export const CampaignCodeTable: React.FC<{ filter: CampaignFilter }> = ({
  filter,
}) => {
  const [partnerCampaigns, { loading }] = usePartnerCampaigns(filter)
  const codeTypeOptions = useGetCodeTypeOptions()
  const [setCodeType, { loading: loadingSetCodeType }] =
    useSetCampaignCodeTypeMutation()
  const [campaignOwnerOptions] = usePartnerCampaignOwners()
  const [setOwner, { loading: loadingSetOwner }] = useSetCampaignOwnerMutation()

  useTitle('Tools | Campaign Codes')

  if (loading) {
    return (
      <Card span={1}>
        <LoadingMessage />
      </Card>
    )
  }

  if (partnerCampaigns.length === 0) {
    return (
      <Card span={1}>
        <StandaloneMessage>No campaigns found</StandaloneMessage>
      </Card>
    )
  }

  return (
    <Card span={1}>
      <Table style={{ fontSize: '1.0rem', overflow: 'visible' }}>
        <TableHeader>
          <TableHeaderColumn>Valid Period</TableHeaderColumn>
          <TableHeaderColumn>Campaign Code</TableHeaderColumn>
          <TableHeaderColumn>Campaign Owner</TableHeaderColumn>
          <TableHeaderColumn>Incentive Type</TableHeaderColumn>
          <TableHeaderColumn>Discount</TableHeaderColumn>
          <TableHeaderColumn>Code Type</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {partnerCampaigns.map((campaign) => {
            const { id, campaignCode, incentive, partnerId, codeType } =
              campaign
            const insuranceTypesByCountry =
              campaign.insuranceTypes.reduce(
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
              <TableRow key={id} border>
                <CenteredCell editable={true}>
                  <CampaignValidityCell
                    campaign={campaign}
                    defaultValidFrom={campaign.validFrom?.split('T')[0]}
                    defaultValidUntil={campaign.validTo?.split('T')[0]}
                  />
                </CenteredCell>
                <CenteredCell>{campaignCode}</CenteredCell>
                <CenteredCell style={{ width: 'calc(100%/6)' }}>
                  <SearchableDropdown
                    value={partnerId}
                    placeholder="No owner"
                    isLoading={loadingSetOwner}
                    onChange={(data) =>
                      data?.value &&
                      toast.promise(
                        setOwner({
                          variables: { id, partnerId: data.value as string },
                          optimisticResponse: {
                            setCampaignOwner: {
                              __typename: 'VoucherCampaign',
                              ...campaign,
                            },
                          },
                        }),
                        {
                          loading: 'Updating campaign owner',
                          success: 'Campaign owner updated',
                          error: 'Could not update campaign owner',
                        },
                      )
                    }
                    noOptionsMessage={() => 'Option not found'}
                    options={mapCampaignOwners(campaignOwnerOptions)}
                  />
                </CenteredCell>
                <CenteredCell style={{ width: 'calc(100%/4)' }}>
                  {getIncentiveText(incentive)}

                  <ThreeColumnGrid style={{ marginTop: '8px' }}>
                    {Object.entries(insuranceTypesByCountry).map(
                      ([country, insuranceTypes]) => (
                        <div
                          key={country}
                          style={{
                            gridArea: country,
                          }}
                        >
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
                </CenteredCell>
                <CenteredCell>{getDiscountDetails(incentive)}</CenteredCell>
                <CenteredCell style={{ width: 'calc(100%/6)' }}>
                  <SearchableDropdown
                    value={codeType}
                    placeholder="No channel"
                    isLoading={loadingSetCodeType}
                    onChange={(data) =>
                      data?.value &&
                      toast.promise(
                        setCodeType({
                          variables: { id, codeType: data.value as string },
                          optimisticResponse: {
                            setCampaignCodeType: {
                              __typename: 'VoucherCampaign',
                              codeType: data.value as string,
                              ...campaign,
                            },
                          },
                        }),
                        {
                          loading: 'Updating code type',
                          success: 'Code type updated',
                          error: 'Could not update code type',
                        },
                      )
                    }
                    noOptionsMessage={() => 'Option not found'}
                    options={codeTypeOptions}
                  />
                </CenteredCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
