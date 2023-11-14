import Personnummer from 'personnummer'
import { ShopSessionCustomerUpdateInput } from '@/services/apollo/generated'

// Search Params from Partner Widget
enum SearchParam {
  Email = 'email',
  Ssn = 'ssn',
}

type CustomerData = Omit<ShopSessionCustomerUpdateInput, 'shopSessionId'>

export const parseCustomerDataSearchParams = (
  searchParams: URLSearchParams,
): [CustomerData, URLSearchParams] => {
  const updatedSearchParams = new URLSearchParams(searchParams.toString())

  const searchSsn = updatedSearchParams.get(SearchParam.Ssn)
  let ssn: string | undefined = undefined
  if (searchSsn && Personnummer.valid(searchSsn)) {
    ssn = Personnummer.parse(searchSsn).format(true)
    updatedSearchParams.delete(SearchParam.Ssn)
  }

  const email = searchParams.get(SearchParam.Email)
  if (email) updatedSearchParams.delete(SearchParam.Email)

  return [
    {
      ...(ssn && { ssn }),
      ...(email && { email }),
    },
    updatedSearchParams,
  ]
}
