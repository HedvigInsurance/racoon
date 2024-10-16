import type { TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'

export async function getPriceTemplate(templateName: string): Promise<TemplateV2> {
  try {
    const module_ = await import(`../priceTemplates/${templateName}`)
    const template = module_.default
    if (typeof template !== 'object' || template.name !== templateName) {
      throw new Error('Template module does not export expected default value')
    }
    return template as TemplateV2
  } catch (err) {
    throw new Error(`Failed to find priceTemplate ${templateName}`, { cause: err })
  }
}
