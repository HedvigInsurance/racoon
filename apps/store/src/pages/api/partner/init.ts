import { NextApiHandler } from 'next'
import { getProductData } from '@/components/ProductPage/ProductPage.helpers'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { createPartnerShopSession } from '@/services/partner/createPartnerShopSession'
import { parseSearchParams } from '@/services/partner/parseSearchParams'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

const handler: NextApiHandler = async (req, res) => {
  if (req.url === undefined) throw new Error(`Missing req.url`)

  try {
    const { searchParams } = new URL(req.url, ORIGIN_URL)
    const { locale, partnerWidgetInitVariables, productName, priceIntentData, customerData } =
      parseSearchParams(searchParams)
    console.info(`Partner Init | Partner ID = ${partnerWidgetInitVariables.partnerId}`)

    const apolloClient = await initializeApolloServerSide({ locale, req, res })
    const { id: shopSessionId, partnerName } = await createPartnerShopSession(
      apolloClient,
      partnerWidgetInitVariables,
    )
    setupShopSessionServiceServerSide({ apolloClient, req, res }).saveId(shopSessionId)
    console.info(`Partner Init | Shop Session = ${shopSessionId}, Partner = ${partnerName}`)

    const service = priceIntentServiceInitServerSide({ req, res, apolloClient })
    const priceTemplate = fetchPriceTemplate(productName)
    if (!priceTemplate) throw new Error(`Missing price template for ${productName}`)
    const priceIntent = await service.create({ productName, priceTemplate, shopSessionId })
    await service.update({
      priceIntentId: priceIntent.id,
      data: priceIntentData,
      customer: { shopSessionId, ...customerData },
    })
    console.info(`Partner Init | Price Intent = ${priceIntent.id}`)

    const { pageLink } = await getProductData({ apolloClient, productName })
    const nextUrl = new URL(pageLink, ORIGIN_URL)
    nextUrl.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
    res.redirect(nextUrl.toString())
  } catch (error) {
    console.error(`Failed to initialize partner widget session: ${error}`)
    // TODO: Redirect to some error page
    const fallbackRedirect = `${ORIGIN_URL}${PageLink.home({ locale: 'se' })}`
    res.redirect(fallbackRedirect)
  }
}

export default handler
