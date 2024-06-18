import { useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'

// Backend-driven experiments as defined in shopSession.experiments
export const useReportShopSessionExperiments = () => {
  const { shopSession } = useShopSession()
  const tracking = useTracking()
  useEffect(() => {
    if (shopSession?.experiments != null) {
      const experiments = { ...shopSession.experiments }
      delete experiments.__typename
      tracking.reportShopSessionExperiments(experiments)
    }
  }, [shopSession?.experiments, tracking])
}
