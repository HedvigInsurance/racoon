import { useRouter } from 'next/router'
import { TypeOfContract } from '@/services/graphql/generated'

const SELECTED_INSURANCE_QUERY_KEY = 'type'

export const useSelectedInsurancesFromURL = () => {
  const router = useRouter()
  const selectedInsurancesFromURL = (router.query[SELECTED_INSURANCE_QUERY_KEY] ??
    []) as Array<TypeOfContract>

  return selectedInsurancesFromURL
}
