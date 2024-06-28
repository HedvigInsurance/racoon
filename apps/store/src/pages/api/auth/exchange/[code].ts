import type { NextApiRequest, NextApiResponse } from 'next'
import { exchangeAuthorizationCode } from '@/services/authApi/oauth'
import { saveAuthTokens } from '@/services/authApi/persist'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { resetSessionServerSide } from '@/utils/resetSessionServerSide'
import { ORIGIN_URL } from '@/utils/url'

enum QueryParam {
  Next = 'next',
  Code = 'code',
}

/**
 * Exchange authorization code for access token and refresh token.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req
  const locale = getLocaleOrFallback().routingLocale
  const fallbackRedirect: [number, string] = [307, PageLink.home({ locale }).toString()]

  if (url === undefined) {
    console.error('Missing url: ', url)
    res.redirect(...fallbackRedirect)
    return
  }

  const nextUrl = new URL(url, ORIGIN_URL)

  const nextQueryParam = nextUrl.searchParams.get(QueryParam.Next)
  if (!nextQueryParam) {
    console.error('Missing next query parameter: ', url)
    res.redirect(...fallbackRedirect)
    return
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
  res.redirect(redirectStatus, redirectUrl)
}

export default handler
