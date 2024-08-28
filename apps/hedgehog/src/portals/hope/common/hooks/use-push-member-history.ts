import { useMemberHistory } from '@hope/common/hooks/use-member-history'
import { useEffect } from 'react'

export const usePushMemberHistory = (memberId?: string | null) => {
  const { pushToMemberHistory } = useMemberHistory()

  return useEffect(() => {
    if (!memberId) {
      return
    }

    pushToMemberHistory(memberId)
  }, [memberId, pushToMemberHistory])
}
