import { extractErrorMessage, TextDatePicker } from '@hedvig-ui'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import toast from 'react-hot-toast'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import { useSetClaimDateOfOccurrenceMutation } from 'types/generated/graphql'
import { useClaim } from '../../../hooks/use-claim'

const useSetClaimDate = () => {
  const [setClaimDateOfOccurrence] = useSetClaimDateOfOccurrenceMutation()

  const setDate = async (claimId: string, date: string | null) => {
    PushUserAction('claim', 'set', 'date_of_occurrence', null)

    return toast.promise(
      setClaimDateOfOccurrence({
        variables: {
          claimId,
          date,
        },
      }),
      {
        loading: 'Setting date of occurrence...',
        success: 'Date of occurrence set',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return { setDate }
}

export const ClaimDatePicker = () => {
  const { dateOfOccurrence, claimId, preferredCurrency } = useClaim()
  const { setDate } = useSetClaimDate()
  const { maybeUpdateSubclaimReserves } = useSetSubclaimReserve()

  const onDateChange = async (newDate: string | null) => {
    try {
      const result = await setDate(claimId, newDate)
      const subclaims = result.data?.setDateOfOccurrence?.subclaims
      const agreement = result.data?.setDateOfOccurrence?.agreement
      if (!agreement || !subclaims?.length || !preferredCurrency) return
      await maybeUpdateSubclaimReserves({ subclaims, preferredCurrency })
    } catch {
      return
    }
  }

  return (
    <TextDatePicker
      value={dateOfOccurrence}
      maxDate={new Date()}
      onChange={onDateChange}
      placeholder="When did it happen?"
    />
  )
}
