import { useRouter } from 'next/router'
import { QueryParam } from './retargeting.constants'
import { RedirectUserParams } from './retargeting.types'

export const useQueryParams = (): RedirectUserParams | null => {
  const router = useRouter()
  const shopSessionId = router.query[QueryParam.ShopSession]

  if (typeof shopSessionId !== 'string') return null

  const campaignCode = router.query[QueryParam.CampaignCode]
  return {
    shopSessionId,
    ...(typeof campaignCode === 'string' && { campaignCode }),
  }
}
