import { type NextApiHandler } from 'next'
import { validateCarDealershipTrial } from '@/features/carDealership/validateCarDealershipTrial'

const handler: NextApiHandler = async (req, res) => {
  try {
    const result = await validateCarDealershipTrial({
      ...req.body,
      dealerId: req.query.dealerId as string,
    })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Unknown error')
  }
}

export default handler
