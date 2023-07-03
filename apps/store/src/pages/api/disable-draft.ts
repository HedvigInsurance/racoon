import { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { slug = '' } = req.query
  res.setDraftMode({ enable: false })

  // Set SameSite=None, so cookie can be read in the Storyblok iframe
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

export default handler
