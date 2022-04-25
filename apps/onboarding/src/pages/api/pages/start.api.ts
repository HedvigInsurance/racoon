import type { NextApiRequest, NextApiResponse } from 'next'
import { handleStartPageForm } from '@/components/StartPage/StartPage.action'
import { getFormData } from '@/lib/get-form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await getFormData(req)
  const result = await handleStartPageForm(formData)

  if (result.type === 'ERROR') {
    return res.status(400).json(result.json)
  }

  return res.redirect(302, result.url)
}

export default handler
