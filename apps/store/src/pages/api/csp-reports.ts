import { NextApiRequest, NextApiResponse } from 'next'

const cspReports = (req: NextApiRequest, res: NextApiResponse<void>) => {
  try {
    const report = JSON.parse(req.body)['csp-report']
    if (report) {
      console.log('csp_violation', JSON.stringify(report))
    }
  } catch (err) {
    console.error('Failed to parse CSP report', err)
  }
  return res.status(204).send()
}

export default cspReports
