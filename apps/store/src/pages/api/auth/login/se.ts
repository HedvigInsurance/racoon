import { NextApiRequest, NextApiResponse } from 'next'
import { loginMemberSeBankId } from '@/services/authApi/login'
import { saveAccessToken } from '@/services/authApi/persist'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info('Logging in with BankID')

  const ssn = req.body.ssn
  if (typeof ssn !== 'string') throw new Error('No ssn provided')

  const accessToken = await loginMemberSeBankId(ssn)
  console.debug('Login successful')

  saveAccessToken(accessToken, { req, res })

  const nextQueryParam = req.query['next']
  const url = typeof nextQueryParam === 'string' ? nextQueryParam : PageLink.home({ locale: 'se' })
  const nextURL = new URL(url, ORIGIN_URL)

  const destination = nextURL.toString()
  console.debug(`Re-directing to destination: ${destination}`)
  return res.redirect(destination)
}

export default handler
