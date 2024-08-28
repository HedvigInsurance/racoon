import { Button } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useWriteOffMemberDebtMutation } from 'types/generated/graphql'

export const WriteOffMemberDebtButton: React.FC<{
  memberId: string
  untilIncludingDate: string | null
}> = ({ memberId, untilIncludingDate }) => {
  const [writeOffMemberDebt, { loading }] = useWriteOffMemberDebtMutation()
  const { confirm } = useConfirmDialog()

  const confirmText =
    untilIncludingDate == null
      ? 'Are you sure?'
      : 'Are you sure? \n⚠️You are about to write off future debt'

  return (
    <Button
      variant="secondary"
      disabled={loading}
      onClick={async () => {
        await confirm(confirmText)
        await toast.promise(
          writeOffMemberDebt({
            variables: { memberId, untilIncludingDate },
          }),
          {
            loading: 'Writing off debt...',
            success: 'Debt written off! 💸',
            error: 'Could not write off debt 🫠',
          },
        )
      }}
    >
      Write off member's outstanding debt
    </Button>
  )
}
