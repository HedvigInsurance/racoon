const CAMPAIGN_CODE_KEY = 'HEDVIG_CAMPAIGN_CODE'

const getPersistedCampaignCode = () => {
  return window.sessionStorage.getItem(CAMPAIGN_CODE_KEY)
}

const saveCampaignCode = (campaignCode: string) => {
  window.sessionStorage.setItem(CAMPAIGN_CODE_KEY, campaignCode)
}

const removeCampaignCode = () => {
  window.sessionStorage.removeItem(CAMPAIGN_CODE_KEY)
}

export const CampaignCode = {
  get: getPersistedCampaignCode,
  save: saveCampaignCode,
  remove: removeCampaignCode,
}
