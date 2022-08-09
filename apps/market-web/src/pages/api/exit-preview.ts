import type { NextApiRequest, NextApiResponse } from 'next'

export default async function exit(_: NextApiRequest, res: NextApiResponse) {
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData()

  const cookies = res.getHeader('Set-Cookie') ?? []
  if (typeof cookies === 'object') {
    res.setHeader(
      'Set-Cookie',
      cookies.map((cookie) => cookie.replace('SameSite=Lax', 'SameSite=None;Secure')),
    )
  }

  // Redirect the user back to the index page.
  res.writeHead(307, { Location: '/' })
  res.end()
}
