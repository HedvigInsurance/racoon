import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import {
  SwitcherCaseDocument,
  type SwitcherCaseQuery,
  type SwitcherCaseQueryVariables,
} from '@/services/graphql/generated'
import { locales } from '@/utils/l10n/locales'
import type { RoutingLocale } from '@/utils/l10n/types'
import { HandledMessage } from './HandledMessage'
import InsuranceSwitchExpirationDateForm from './InsuranceSwitchExpirationDateForm'

type Props = {
  params: { id: string }
}

const DEFAULT_LOCALE: RoutingLocale = locales['sv-SE'].routingLocale

const { getApolloClient } = setupApolloClient({ locale: DEFAULT_LOCALE })
const apolloClient = getApolloClient()

export default async function InsuranceSwitchExpirationDate({ params }: Props) {
  const {
    data: { switcherCase },
  } = await apolloClient.query<SwitcherCaseQuery, SwitcherCaseQueryVariables>({
    query: SwitcherCaseDocument,
    variables: { id: params.id },
  })

  const { isCompleted } = switcherCase

  if (isCompleted) {
    return <HandledMessage />
  }

  return <InsuranceSwitchExpirationDateForm id={params.id} />
}
