import { ApolloError } from '@apollo/client'
import { useTranslation } from 'next-i18next'

export const useErrorMessage = (error?: ApolloError | null) => {
  const { t } = useTranslation('common')

  if (!error) return

  let message: string | undefined
  try {
    message = error.extraInfo?.userError?.message
  } catch (error: unknown) {
    console.warn('Failed to extract error message', error)
  }

  return message ?? t('UNKNOWN_ERROR_MESSAGE')
}
