import { MutationResult } from '@apollo/client'
import { UserError } from '@/services/apollo/generated'

// TODO: Localize generic error
export const getMutationError = (
  result: MutationResult<unknown>,
  resultData: { userError?: UserError | null } | undefined,
): UserError | null => {
  if (result.error) {
    return { message: 'Something went wrong' }
  }
  return resultData?.userError ?? null
}
