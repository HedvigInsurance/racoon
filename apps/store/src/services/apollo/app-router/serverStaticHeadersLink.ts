import { setContext } from '@apollo/client/link/context'
import { toIsoLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

export const serverStaticHeadersLink = ({ locale }: { locale: RoutingLocale }) =>
  setContext((_, prevContext) => {
    return {
      ...prevContext,
      headers: {
        ...prevContext.headers,
        'Hedvig-Language': toIsoLocale(locale),
      },
    }
  })
