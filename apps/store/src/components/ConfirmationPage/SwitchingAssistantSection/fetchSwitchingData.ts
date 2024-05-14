import { type ShopSessionService } from '@/services/shopSession/ShopSessionService'
import type { SwitchingAssistantData } from './SwitchingAssistantSection.types'

export async function fetchSwitchingData(
  shopSessionService: ShopSessionService,
  shopSessionOutcomeId: string,
): Promise<SwitchingAssistantData | null> {
  const outcome = await fetchOutcomeData(shopSessionService, shopSessionOutcomeId)
  if (!outcome) return null

  const switchingContract = outcome.createdContracts.find(
    (item) => !!item.externalInsuranceCancellation?.bankSignering,
  )
  if (!switchingContract) return null

  const externalInsurer = switchingContract.externalInsuranceCancellation?.externalInsurer
  if (!externalInsurer) return null

  return {
    shopSessionOutcomeId: outcome.id,
    companyDisplayName: externalInsurer.displayName,
  }
}

async function fetchOutcomeData(shopSessionService: ShopSessionService, shopSessionId: string) {
  const shopSessionOutcomeId = await shopSessionService.fetchOutcomeId(shopSessionId)
  if (!shopSessionOutcomeId) {
    return null
  }

  const outcome = await shopSessionService.fetchOutcome(shopSessionOutcomeId)
  return outcome
}
