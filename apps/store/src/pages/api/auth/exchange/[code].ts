import { NextApiRequest, NextApiResponse } from 'next'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import { ORIGIN_URL, PageLink } from '@/utils/PageLink'
import { resetSessionServerSide } from '@/utils/resetSessionServerSide'

enum QueryParam {
  Next = 'next',
  Code = 'code',
}

/**
 * Exchange authorization code for access token and refresh token.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req
  const fallbackRedirect: [number, string] = [307, PageLink.home()]

  if (url === undefined) {
    console.error('Missing url: ', url)
    return res.redirect(...fallbackRedirect)
  }

  const nextUrl = new URL(url, ORIGIN_URL)

  const nextQueryParam = nextUrl.searchParams.get(QueryParam.Next)
  if (!nextQueryParam) {
    console.error('Missing next query parameter: ', url)
    return res.redirect(...fallbackRedirect)
  }
  nextUrl.searchParams.delete(QueryParam.Next)
  nextUrl.pathname = nextQueryParam

  const redirectStatus = 307
  const redirectUrl = nextUrl.toString()
  const authorizationCode = req.query[QueryParam.Code] as string

  try {
    await resetSessionServerSide(req, res)
  } catch (error) {
    console.warn('Failed to reset current session: ', error)
  }

  try {
    const { accessToken, refreshToken } = await exchangeAuthorizationCode(authorizationCode)
    saveAuthTokens({ accessToken, refreshToken, req, res })
  } catch (error) {
    console.warn('Failed to exchange authorization code: ', error)
  }

  console.log(`Re-directing to destination: ${redirectUrl}`)
  return res.redirect(redirectStatus, redirectUrl)
}

export default handler
