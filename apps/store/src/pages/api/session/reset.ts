import { type NextApiRequest, type NextApiResponse } from 'next'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'
import { resetSessionServerSide } from '@/utils/resetSessionServerSide'

/**
 * Reset current ShopSession and navigate to the next page.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await resetSessionServerSide(req, res)

  const nextQueryParam = req.query['next']
  let nextURL = new URL(ORIGIN_URL)
  if (typeof nextQueryParam === 'string') {
    nextURL = new URL(nextQueryParam, nextURL)
  } else {
    nextURL = new URL(PageLink.home(), nextURL)
  }

  const destination = nextURL.toString()
  console.log(`Re-directing to destination: ${destination}`)
  res.redirect(destination)
}

export default handler
