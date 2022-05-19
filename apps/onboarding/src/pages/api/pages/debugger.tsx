import type { NextApiRequest, NextApiResponse } from 'next'
import { handleDebuggerForm } from '@/components/DebuggerPage/DebuggerPage.action'
import { getFormData } from '@/lib/get-form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await getFormData(req)
  const url = await handleDebuggerForm(formData)
  return res.redirect(302, url)
}

export default handler
