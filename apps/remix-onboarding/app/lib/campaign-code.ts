import { createCookie } from 'remix'

const CAMPAIGN_CODE_COOKIE_KEY = '_hvcode'

const cookie = createCookie(CAMPAIGN_CODE_COOKIE_KEY)

const getPersistedCampaignCode = async (cookieHeader: string | null) => {
  return (await cookie.parse(cookieHeader)) ?? undefined
}

const saveCampaignCode = async (campaignCode: string) => {
  return await cookie.serialize(campaignCode)
}

export const CampaignCode = {
  get: getPersistedCampaignCode,
  save: saveCampaignCode,
}
