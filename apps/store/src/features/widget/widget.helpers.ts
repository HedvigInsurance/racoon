import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'

const WIDGET_PRODUCT_NAMES = ['SE_WIDGET_APARTMENT_BRF', 'SE_WIDGET_APARTMENT_RENT'] as const

export type WidgetProductName = (typeof WIDGET_PRODUCT_NAMES)[number]

export const isWidgetProductName = (product: string): product is WidgetProductName => {
  return Object.values(WIDGET_PRODUCT_NAMES).includes(product as WidgetProductName)
}

const MAPPING: Record<WidgetProductName, string> = {
  SE_WIDGET_APARTMENT_BRF: 'SE_WIDGET_APARTMENT',
  SE_WIDGET_APARTMENT_RENT: 'SE_WIDGET_APARTMENT',
}

export const getPriceTemplate = (product: WidgetProductName): Template => {
  const template = fetchPriceTemplate(MAPPING[product])
  if (!template) throw new Error(`No template found for product ${product}`)
  return template
}
