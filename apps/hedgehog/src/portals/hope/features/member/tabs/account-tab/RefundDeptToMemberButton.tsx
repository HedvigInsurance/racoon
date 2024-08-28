import { Button, useConfirmDialog } from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useRefundDeptToMemberMutation } from 'types/generated/graphql'

export const RefundDeptToMemberButton: React.FC<{
  memberId: string
  initiateAutomaticPayout: boolean
}> = ({ memberId, initiateAutomaticPayout }) => {
  const [refundDeptToMember, { loading }] = useRefundDeptToMemberMutation()
  const { confirm } = useConfirmDialog()

  const buttonText = initiateAutomaticPayout
    ? '⚡ Automatic refund dept to member'
    : '📝 Book manual refund of dept to member'

  const conformationText = initiateAutomaticPayout
    ? 'You are about to create a automatic refund'
    : 'You are about to create a manual refund. \n ⚠️This must be manually paid out! ⚠️'

  return (
    <Button
      variant={initiateAutomaticPayout ? 'primary' : 'secondary'}
      disabled={loading}
      onClick={async () => {
        await confirm(conformationText)
        await toast.promise(
          refundDeptToMember({
            variables: { memberId, initiateAutomaticPayout },
          }),
          {
            loading: 'Refunding...',
            success: 'Refund created! 💸',
            error: 'Could not refund member 🫠',
          },
        )
      }}
      style={{ marginLeft: '1.0em' }}
    >
      {buttonText}
    </Button>
  )
}
