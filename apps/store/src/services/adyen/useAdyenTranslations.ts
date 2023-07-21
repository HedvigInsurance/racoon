import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useAdyenTranslations = (): {
  title: string
  payButton: string
  locale: string
  success: string
  retry: string
  error: { heading: string; body: string }
} => {
  const { locale } = useCurrentLocale()

  switch (locale) {
    case 'da-DK':
      return {
        locale,
        title: 'Tilknyt betaling',
        payButton: 'Tilknyt betalingskort',
        success: 'Betaling er tilknyttet!',
        retry: 'Prøv igen',
        error: {
          heading: 'Der opstod en uventet fejl',
          body: 'Prøv venligst igen eller kontakt os i chatten hvis problemet fortsætter.',
        },
      }
    case 'nb-NO':
      return {
        locale: 'no-NO',
        title: 'Koble til betaling',
        payButton: 'Koble til kredittkort',
        success: 'Betaling tilkoblet!',
        retry: 'Forsøk en gang til',
        error: {
          heading: 'Det oppstod en feil',
          body: 'Vennligst prøv igjen eller gå tilbake. Hvis feilen vedvarer, vennligst kontakt oss i chatten',
        },
      }
    default:
      return {
        locale: 'en-US',
        title: 'Connect payment',
        payButton: 'Connect credit card',
        success: 'Payment connected!',
        retry: 'Try again',
        error: {
          heading: 'Something went wrong',
          body: 'We could not connect your credit card. Please try again.',
        },
      }
  }
}
