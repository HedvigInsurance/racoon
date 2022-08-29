import type { NextApiRequest, NextApiResponse } from 'next'
import { prepopulateFormTemplate } from '@/components/PriceCalculatorForm/PriceCalculatorForm.helpers'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { FormTemplateService } from '@/services/formTemplate/FormTemplateService'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntent.helpers'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isCountryCode } from '@/utils/isCountryCode'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId, formTemplateId } = req.query
  const { countryCode, ...data } = req.body

  if (typeof productId !== 'string' || typeof formTemplateId !== 'string') {
    throw new Error('Malformed product price API URL')
  }

  if (!isCountryCode(countryCode)) {
    return res.status(500).json({ message: 'Country Code is required' })
  }

  const apolloClient = initializeApollo()
  const formTemplateService = new FormTemplateService()

  const [shopSession, formTemplate] = await Promise.all([
    getShopSessionServerSide({ req, res, apolloClient, countryCode }),
    formTemplateService.fetch({ id: formTemplateId }),
  ])

  if (formTemplate === null) {
    return res.status(404).json({ message: `Form Template not found: ${formTemplateId}` })
  }

  const priceIntentService = priceIntentServiceInitServerSide({
    req,
    res,
    shopSession,
    apolloClient,
  })
  const priceIntent = await priceIntentService.fetch(productId)

  const response = await priceIntentService.update({ priceIntentId: priceIntent.id, data })

  const populatedTemplate = prepopulateFormTemplate(formTemplate, response.data)

  if (populatedTemplate.sections.every((section) => section.state === 'VALID')) {
    await priceIntentService.confirm(priceIntent.id)
  }

  return res.redirect(302, PageLink.product({ slug: productId }))
}

export default handler
