import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { TRUSTLY_SCRIPT_SRC } from './Trustly.constants'

export const useTrustly = () => {
  const { locale } = useCurrentLocale()

  const handleOnLoad = () => {
    window.TrustlyWidget.init(
      'test-end-user-id',
      'test-username',
      (data) => {
        console.log(data)
      },
      { locale },
    )
  }

  return { handleOnLoad, scriptSrc: TRUSTLY_SCRIPT_SRC }
}
