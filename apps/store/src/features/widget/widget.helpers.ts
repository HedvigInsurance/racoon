import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import type { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import type { PriceIntentService } from '@/services/priceIntent/PriceIntentService'
import type { WidgetFlowStory } from '@/services/storyblok/storyblok'
import { getStoryById } from '@/services/storyblok/storyblok'
import { parsePriceIntentDataSearchParams } from './parseSearchParams'

const widgetPriceTemplateName = (product: string, compare: boolean): string | undefined => {
  switch (product) {
    case 'SE_APARTMENT_BRF':
    case 'SE_APARTMENT_RENT':
      return compare ? 'SE_WIDGET_APARTMENT' : 'SE_WIDGET_APARTMENT_NO_COMPARE'
  }
}

export const getWidgetPriceTemplate = (product: string, compare: boolean): Template => {
  const templateName = widgetPriceTemplateName(product, compare)
  const template = getPriceTemplate(templateName || product)
  if (!template) throw new Error(`No template found for product ${product}`)
  return template
}

type CreatePriceIntentParams = {
  service: PriceIntentService
  productName: string
  priceTemplate: Template
  shopSessionId: string
  searchParams: URLSearchParams
}

export const createPriceIntent = async (
  params: CreatePriceIntentParams,
): Promise<[PriceIntent, URLSearchParams]> => {
  const priceIntent = await params.service.create({
    productName: params.productName,
    priceTemplate: params.priceTemplate,
    shopSessionId: params.shopSessionId,
  })

  const [priceIntentData, updatedSearchParams] = parsePriceIntentDataSearchParams(
    params.searchParams,
  )

  if (Object.keys(priceIntentData).length === 0) return [priceIntent, updatedSearchParams]

  await params.service.update({
    priceIntentId: priceIntent.id,
    data: priceIntentData,
    customer: { shopSessionId: params.shopSessionId },
  })

  return [priceIntent, updatedSearchParams]
}

export const fetchFlowStory = (flow: string, draft?: boolean) => {
  return getStoryById<WidgetFlowStory>({
    id: flow,
    version: draft ? 'draft' : undefined,
  })
}
