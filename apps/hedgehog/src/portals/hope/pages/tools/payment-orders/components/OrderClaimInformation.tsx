import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { Label, Popover } from '@hedvig-ui'
import { PickedLocale, PickedLocaleFlag } from '@hope/features/config/constants'
import { Link } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { Styled } from '../'

export const OrderClaimInformation = ({
  order,
}: {
  order: PaymentOrderInformationFragment
}) => {
  return (
    <>
      <div>
        <Label>Claim</Label>
        <Popover contents="Go to claim">
          <Link target="_blank" to={`/claims/${order.claimId}`}>
            {order.claimId}
          </Link>
        </Popover>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}
      >
        <div>
          <Label>Member</Label>
          <div>
            <Popover contents="Go to member">
              <Link target="_blank" to={`/members/${order.member.memberId}`}>
                {order.member.firstName} {order.member.lastName}
              </Link>
            </Popover>{' '}
            {PickedLocaleFlag[order.member.pickedLocale as PickedLocale]}
          </div>
        </div>
        <div>
          <Label>Member ID</Label>
          <Popover contents="Copy Member ID">
            <Styled.InfoText
              onClick={() => {
                copy(order.member.memberId)
                toast.success('Member ID copied')
              }}
            >
              {order.member.memberId}
            </Styled.InfoText>
          </Popover>
        </div>
      </div>
    </>
  )
}
