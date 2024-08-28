import {
  CampaignOwnerPartner,
  GetPartnerCampaignOwnersQueryResult,
  useGetPartnerCampaignOwnersQuery,
} from 'types/generated/graphql'

type PartnerCampaignOwnersReturnTuple = [
  ReadonlyArray<CampaignOwnerPartner>,
  GetPartnerCampaignOwnersQueryResult,
]

export const usePartnerCampaignOwners =
  (): PartnerCampaignOwnersReturnTuple => {
    const queryResult = useGetPartnerCampaignOwnersQuery()
    const campaignOwnerPartners = (queryResult.data?.getPartnerCampaignOwners ??
      []) as CampaignOwnerPartner[]
    return [campaignOwnerPartners, queryResult]
  }
