import { type NextApiHandler } from 'next'
import { createCarDealershipTrial } from '@/features/carDealership/DebuggerCarTrial/createCarDealershipTrial'

const handler: NextApiHandler = async (req, res) => {
  try {
    const result = await createCarDealershipTrial({
      ...req.body,
      dealerId: req.query.dealerId as string,
    })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Unknown error')
  }
}

export default handler
