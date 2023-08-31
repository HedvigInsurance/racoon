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

  const apolloClient = await initializeApolloServerSide({ req, res, locale: userParams.locale })
  const data = await fetchRetargetingData(apolloClient, userParams.shopSessionId)
  const redirect = getUserRedirect(userParams, data)

  console.info(`Redirecting | Redirecting user to ${redirect.type}`)
  res.redirect(redirect.url)
}

export default handler
