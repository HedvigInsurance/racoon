import type { NextApiRequest, NextApiResponse } from 'next'

const cspReports = (req: NextApiRequest, res: NextApiResponse<void>) => {
  try {
    // NOTE: Requests get application/csp-report content-type and aren't automatically identified as JSON
    const report = JSON.parse(req.body)['csp-report']
    if (report) {
      console.log('csp_violation %j', report)
    }
  } catch (err) {
    console.error('Failed to parse CSP report', err)
  }
  return res.status(204).send()
}

export default cspReports
