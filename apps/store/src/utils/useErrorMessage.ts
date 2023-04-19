import { isApolloError } from '@apollo/client'
import { useTranslation } from 'next-i18next'

export const useErrorMessage = (error?: Error | null) => {
  const { t } = useTranslation('common')

  if (!error) return

  let message: string | undefined
  try {
    if (isApolloError(error)) {
      message = error.extraInfo?.userError?.message
    }
  } catch (error: unknown) {
    console.warn('Failed to extract error message', error)
  }

  return message ?? t('UNKNOWN_ERROR_MESSAGE')
}
