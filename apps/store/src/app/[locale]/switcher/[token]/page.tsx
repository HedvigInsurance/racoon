import type { RoutingLocale } from '@/utils/l10n/types'
import InsuranceSwitchExpirationDateForm from './InsuranceSwitchExpirationDateForm'

type Props = {
  params: { id: string; locale: RoutingLocale }
}

export default function InsuranceSwitchExpirationDate({ params }: Props) {
  return <InsuranceSwitchExpirationDateForm id={params.id} locale={params.locale} />
}
