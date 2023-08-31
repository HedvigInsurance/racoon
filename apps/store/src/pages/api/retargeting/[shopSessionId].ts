import { type NextApiRequest, type NextApiResponse } from 'next'
import { fetchRetargetingData } from '@/features/retargeting/fetchRetargetingData'
import { getUserRedirect } from '@/features/retargeting/getUserRedirect'
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

  console.info(`Retargeting | Redirecting user to ${redirect.type}`)
  console.debug(`Retargeting | Redirect URL: ${redirect.url}`)
  res.redirect(redirect.url)
}

export default handler
