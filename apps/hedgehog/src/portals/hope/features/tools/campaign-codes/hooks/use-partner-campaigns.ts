import {
  CampaignFilter,
  FindPartnerCampaignsQueryResult,
  useFindPartnerCampaignsQuery,
  VoucherCampaign,
} from 'types/generated/graphql'

type VoucherCampaignReturnTuple = [
  ReadonlyArray<VoucherCampaign>,
  FindPartnerCampaignsQueryResult,
]

export const usePartnerCampaigns = (
  campaignFilter: CampaignFilter,
): VoucherCampaignReturnTuple => {
  const queryResult = useFindPartnerCampaignsQuery({
    variables: { input: campaignFilter },
  })
  const voucherCampaigns = (queryResult.data?.findPartnerCampaigns ??
    []) as VoucherCampaign[]
  return [voucherCampaigns, queryResult]
}
