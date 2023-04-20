import { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line @typescript-eslint/require-await
const exit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug = '' } = req.query
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData()

  // set the cookies to None
  const cookies = res.getHeader('Set-Cookie') ?? []
  if (typeof cookies === 'object') {
    res.setHeader(
      'Set-Cookie',
      cookies.map((cookie) => cookie.replace('SameSite=Lax', 'SameSite=None;Secure')),
    )
  }

  // Redirect the user back to the index page.
  res.redirect(`/${slug}`)
}

export default exit
