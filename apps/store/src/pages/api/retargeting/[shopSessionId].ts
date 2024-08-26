import { type NextApiRequest, type NextApiResponse } from 'next'
import { QueryParam as CheckoutPageQueryParam } from '@/app/[locale]/new/checkout/CheckoutPage.constants'
import { addOffersToCart } from '@/features/retargeting/addOffersToCart'
import { fetchRetargetingData } from '@/features/retargeting/fetchRetargetingData'
import { getUserRedirect } from '@/features/retargeting/getUserRedirect'
import { RedirectType } from '@/features/retargeting/getUserRedirect'
import { parseQueryParams } from '@/features/retargeting/parseQueryParams'
import { initializeApolloServerSide } from '@/services/apollo/client'

/**
 * Redirect user to the correct page from a re-targeting link.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info('Retargeting | Redirecting user')
  const userParams = parseQueryParams(req.query)
  if (!userParams) {
    res.statusCode = 400
    res.end()
    return
  }
  console.debug('Retargeting | Received user params', userParams)

  const apolloClient = await initializeApolloServerSide({ req, res, locale: userParams.locale })
  const data = await fetchRetargetingData(apolloClient, userParams.shopSessionId)
  const redirect = getUserRedirect(userParams, data)

  // TODO: handle the case where we fail to add offers
  if (redirect.type === RedirectType.ModifiedCart) {
    await addOffersToCart(apolloClient, userParams.shopSessionId, redirect.offers)
    redirect.url.searchParams.set(CheckoutPageQueryParam.ExpandCart, '1')
  }

  userParams.queryParams.forEach(([key, value]) =>
    redirect.url.searchParams.set(key, String(value)),
  )

  console.info(`Retargeting | Redirecting user to ${redirect.type}`)
  console.debug(`Retargeting | Redirect URL: ${redirect.url.toString()}`)
  res.redirect(redirect.url.toString())
}

export default handler
