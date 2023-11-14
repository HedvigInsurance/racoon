import { type NextApiHandler } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const locale = req.body.locale
  if (!isRoutingLocale(locale)) {
    res.status(400).json({ message: `Invalid locale: ${locale}` })
    return
  }

  const flow = req.body.flow
  if (typeof flow !== 'string') {
    res.status(400).json({ message: 'Missing required input: "flow"' })
    return
  }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient })

  const { countryCode } = getCountryByLocale(locale)
  const shopSession = await shopSessionService.create({ countryCode })

  res.redirect(PageLink.widgetSelectProduct({ locale, flow, shopSessionId: shopSession.id }).href)
}

export default handler
