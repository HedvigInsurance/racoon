import { MutationResult } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { UserError } from '@/services/apollo/generated'

/**
 * @deprecated Use useErrorMessage() instead
 */
export const useGetMutationError = () => {
  const { t } = useTranslation('common')

  return useCallback(
    (result: MutationResult<unknown>, resultData: { userError?: UserError | null } | undefined) => {
      if (result.error) {
        return { message: t('UNKNOWN_ERROR_MESSAGE') }
      }
      return resultData?.userError ?? null
    },
    [t],
  )
}
