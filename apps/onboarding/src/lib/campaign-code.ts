import Cookie from 'js-cookie'

const CAMPAIGN_CODE_COOKIE_KEY = '_hvcode'

const getPersistedCampaignCode = () => {
  return Cookie.get(CAMPAIGN_CODE_COOKIE_KEY)
}

const saveCampaignCode = (campaignCode: string) => {
  Cookie.set(CAMPAIGN_CODE_COOKIE_KEY, campaignCode)
}

const removeCampaignCode = () => {
  Cookie.remove(CAMPAIGN_CODE_COOKIE_KEY)
}

export const CampaignCode = {
  get: getPersistedCampaignCode,
  save: saveCampaignCode,
  remove: removeCampaignCode,
}
