import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getPathnameFromUrl } from '@/utils/getPathnameFromUrl'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getUrlLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { ORIGIN_URL } from '@/utils/url'

const recommendHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query = {} } = req
    const { attributed_to: attributedTo, initiated_from: initiatedFrom, next = '' } = query

    if (attributedTo && typeof attributedTo !== 'string') {
      return res.status(400).send('Expected attributed_to query param to have single value')
    }
    if (initiatedFrom && typeof initiatedFrom !== 'string') {
      return res.status(400).send('Expected initiated_from query param with single value')
    }
    if (!initiatedFrom && !attributedTo) {
      return res
        .status(400)
        .send('Expected at least one of initiated_from, attributed_to to have value')
    }
    if (typeof next !== 'string') {
      return res.status(400).send('Multiple next values not supported')
    }

    const routingLocale = getUrlLocale(next)
    const { countryCode } = getCountryByLocale(routingLocale)

    const apolloClient = await initializeApolloServerSide({ req, res })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    const shopSession = await shopSessionService.create({
      countryCode,
      attributedTo,
      initiatedFrom,
    })
    shopSessionService.saveId(shopSession.id)

    const targetUrl = new URL(req.url ?? '', ORIGIN_URL)
    targetUrl.pathname = next
      ? getPathnameFromUrl(next)
      : PageLink.home({ locale: routingLocale }).pathname
    targetUrl.searchParams.delete('next')
    targetUrl.searchParams.delete('attributed_to')
    targetUrl.searchParams.delete('initiated_from')

    return res.redirect(307, targetUrl.toString())
  } catch (err) {
    console.log('Error when handling recommend redirect, redirecting to index page', err)
    const locale = getUrlLocale(String(req.query.next))
    return res.redirect(307, PageLink.home({ locale }).toString())
  }
}

export default recommendHandler
