import type { NextApiRequest, NextApiResponse } from 'next'
import { handleDebuggerForm } from '@/components/DebuggerPage/DebuggerPage.action'
import { getFormData } from '@/lib/get-form-data'
import { getErrorMessage } from '@/lib/getErrorMessage'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const formData = await getFormData(req)

  try {
    const url = await handleDebuggerForm(formData)
    return res.redirect(302, url)
  } catch (error) {
    return res.status(400).json({ form: getErrorMessage(error) })
  }
}

export default handler
