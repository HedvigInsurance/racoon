import type { RoutingLocale } from '@/utils/l10n/types'
import { CheckoutPage } from './CheckoutPage'

type Params = { locale: RoutingLocale }

type Props = { params: Params }

export default function Page({ params }: Props) {
  return <CheckoutPage locale={params.locale} />
}

export const dynamic = 'force-dynamic'
