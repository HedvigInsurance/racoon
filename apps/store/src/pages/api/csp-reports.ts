import { NextApiRequest, NextApiResponse } from 'next'
import logger from '@/services/logger/server'

const cspReports = (req: NextApiRequest, res: NextApiResponse<void>) => {
  try {
    const report = JSON.parse(req.body)['csp-report']
    if (report) {
      logger.child({ csp: report }).info('csp violation')
    }
  } catch (err) {
    logger.error('Failed to parse CSP report', err)
  }
  return res.status(204).send()
}

export default cspReports
