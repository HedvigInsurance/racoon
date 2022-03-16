import type { NextApiRequest, NextApiResponse } from 'next'
import { getFormData } from '@/lib/get-form-data'
import { createApolloClient } from '@/services/apollo'
import { EditQuoteDocument, QuoteCartQuotesDocument } from '@/services/apollo/types'
import type {
  EditQuoteMutation,
  EditQuoteMutationVariables,
  QuoteCartQuotesQuery,
  QuoteCartQuotesQueryVariables,
} from '@/services/apollo/types'


export const config = {
  api: {
    bodyParser: false,
  },
}

const client = createApolloClient()

const getSubType = (isStudent: boolean, typeOfContract: string) => {
  const contractType = typeOfContract.includes('RENT') ? 'RENT' : 'BRF'

  if (isStudent) {
    return `STUDENT_${contractType}`
  }

  return contractType
}

const handleForeverPageForm = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteCartId = req.query.quoteCartId as string
  const {
    householdSize: rawHouseholdSize,
    isStudent: rawIsStudent,
    livingSpace: rawLivingSpace,
  } = await getFormData(req)

  const householdSize = parseInt(rawHouseholdSize as string, 10)
  const isStudent = rawIsStudent === 'YES'
  const livingSpace = parseInt(rawLivingSpace as string, 10)

  try {
    const { data } = await client.query<QuoteCartQuotesQuery, QuoteCartQuotesQueryVariables>({
      query: QuoteCartQuotesDocument,
      variables: { id: quoteCartId },
    })

    const quotes = data.quoteCart.bundle?.quotes ?? []

    await Promise.all(
      quotes.map(async (quote) => {
        const data = {
          numberCoInsured: householdSize - 1,
          isStudent,
          subType: getSubType(isStudent, quote.data.typeOfContract),
          livingSpace: livingSpace || quote.data.livingSpace,
        }

        return await client.mutate<EditQuoteMutation, EditQuoteMutationVariables>({
          mutation: EditQuoteDocument,
          variables: {
            quoteCartId,
            quoteId: quote.id,
            payload: { data },
          },
        })
      }),
    )

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error(JSON.stringify(error, null, 2))
    return res.status(400).json({ form: 'Error' })
  }
}

export default handleForeverPageForm
