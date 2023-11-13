import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'

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
