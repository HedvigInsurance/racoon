import { NextApiRequest, NextApiResponse } from 'next'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'
import { resetSessionServerSide } from '@/utils/resetSessionServerSide'

/**
 * Reset current ShopSession and navigate to the next page.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await resetSessionServerSide(req, res)

  const nextQueryParam = req.query['next']
  const nextURL = new URL(ORIGIN_URL)
  if (typeof nextQueryParam === 'string') {
    nextURL.pathname = nextQueryParam
  } else {
    nextURL.pathname = PageLink.home()
  }

  const destination = nextURL.toString()
  console.log(`Re-directing to destination: ${destination}`)
  return res.redirect(destination)
}

export default handler
