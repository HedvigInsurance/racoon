import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { PriceIntentService } from '@/services/priceIntent/PriceIntentService'

const PRODUCT_TO_TEMPLATE = new Map<string, string>([
  ['SE_WIDGET_APARTMENT_BRF', 'SE_WIDGET_APARTMENT'],
  ['SE_WIDGET_APARTMENT_RENT', 'SE_WIDGET_APARTMENT'],
])

export const getPriceTemplate = (product: string): Template => {
  const templateName = PRODUCT_TO_TEMPLATE.get(product)
  const template = fetchPriceTemplate(templateName || product)
  if (!template) throw new Error(`No template found for product ${product}`)
  return template
}

type CreatePriceIntentParams = {
  service: PriceIntentService
  productName: string
  shopSessionId: string
}

export const createPriceIntent = async (params: CreatePriceIntentParams): Promise<PriceIntent> => {
  const priceIntent = await params.service.create({
    productName: params.productName,
    priceTemplate: getPriceTemplate(params.productName),
    shopSessionId: params.shopSessionId,
  })
  return priceIntent
}
