import { type NextApiRequest, type NextApiResponse } from 'next'
import { QueryParam as CartPageQueryParam } from '@/components/CartPage/CartPage.constants'
import { addOffersToCart } from '@/features/retargeting/addOffersToCart'
import { fetchRetargetingData } from '@/features/retargeting/fetchRetargetingData'
import { getUserRedirect } from '@/features/retargeting/getUserRedirect'
import { RedirectType } from '@/features/retargeting/getUserRedirect'
import { parseQueryParams } from '@/features/retargeting/parseQueryParams'
import { initializeApolloServerSide } from '@/services/apollo/client'

/**
 * Redirect user to the correct page from a retargeting link.
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
  const nextURL = new URL(redirect.url)

  // TODO: handle the case we failed to add offers
  if (redirect.type === RedirectType.ModifiedCart) {
    await addOffersToCart(apolloClient, userParams.shopSessionId, redirect.offers)
    nextURL.searchParams.set(CartPageQueryParam.ExpandCart, '1')
  }

  console.info(`Retargeting | Redirecting user to ${redirect.type}`)
  console.debug(`Retargeting | Redirect URL: ${nextURL.toString()}`)
  res.redirect(nextURL.toString())
}

export default handler
