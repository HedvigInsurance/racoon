import styled from '@emotion/styled'
import {
  Button,
  Flex,
  InfoTag,
  Input,
  isStringNumber,
  Spacing,
} from '@hedvig-ui'
import * as React from 'react'
import { FormEvent, useState } from 'react'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { useCreateClaimNote } from '@hope/features/claims/claim-details/ClaimNotes/use-create-claim-note'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import { useClaim } from '../../../../hooks/use-claim'
import { ClaimState } from '@hope/features/config/constants'
import { ReserverPlaceholder } from '../NoCarrierPlaceholder'
import { ClaimNoteType } from 'types/generated/graphql'

const ReservesTag = styled(InfoTag)`
  font-weight: bold;
  font-size: 0.9em;
  width: auto;
  margin-right: 0.5em;
`

const ReservesText = styled.span`
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const SubclaimReserve: React.FC<{
  subclaimId: string
}> = ({ subclaimId }) => {
  const { claimId, getSubclaim, preferredCurrency, claimState, agreement } =
    useClaim()
  const subclaim = getSubclaim(subclaimId)
  const carrier = agreement?.carrier
  const reserve = subclaim?.reserve
  const { setReserve } = useSetSubclaimReserve()
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')

  const { createNote } = useCreateClaimNote()

  const onUpdateReserve = async (e: FormEvent) => {
    e.preventDefault()

    if (!subclaim) return

    await setReserve(
      subclaimId,
      subclaim.reserves,
      {
        amount: +value,
        currency: preferredCurrency!,
      },
      undefined,
      note,
    )

    PushUserAction('claim', 'update', 'reserve', null)

    if (note) {
      await createNote(claimId, note, ClaimNoteType.Text)
      PushUserAction('claim', 'add', 'note', null)
    }

    setValue('')
    setNote('')
  }

  const hasReserve = !!reserve?.amount
  const defaultReserve = subclaim?.claimType?.defaultReserve
  const claimType = subclaim?.claimType?.displayName
  const canAddDefaultReserve =
    !hasReserve &&
    !!defaultReserve &&
    !!preferredCurrency &&
    claimState !== ClaimState.Closed

  return (
    <Flex
      align="center"
      direction="column"
      gap="small"
      style={{ marginBlock: '1.0em' }}
    >
      {hasReserve && (
        <Flex gap="tiny" align="center">
          <ReservesTag status="highlight">
            {reserve.amount} {reserve.currency}
          </ReservesTag>{' '}
          <ReservesText>reserved</ReservesText>
          <Button
            variant="tertiary"
            style={{ marginLeft: 'auto', padding: '0.25rem' }}
            onClick={() => {
              if (!subclaim) return
              setReserve(subclaimId, subclaim.reserves, {
                amount: 0,
                currency: preferredCurrency!,
              })
            }}
          >
            Remove reserve
          </Button>
        </Flex>
      )}

      {canAddDefaultReserve && (
        <Flex gap="small" align="center">
          <ReservesTag status="warning">No reserve set ⚠️</ReservesTag>
          <Button
            variant="tertiary"
            style={{ padding: 0 }}
            onClick={() => {
              if (!subclaim) return
              setReserve(
                subclaimId,
                subclaim.reserves,
                {
                  amount: defaultReserve,
                  currency: preferredCurrency,
                },
                undefined,
                `Default reserve for ${claimType}`,
              )
            }}
          >
            Use default reserve
          </Button>
        </Flex>
      )}
      {!carrier ? (
        <ReserverPlaceholder />
      ) : (
        <form onSubmit={onUpdateReserve} style={{ width: '100%' }}>
          <Input
            value={value}
            placeholder="Reserve amount"
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Spacing top="small" />
          <Input
            value={note}
            placeholder="Reserve note"
            onChange={(e) => setNote(e.currentTarget.value)}
          />
          <Spacing top="small" />
          <Button disabled={!isStringNumber(value) || value === ''}>
            Update reserve
          </Button>
        </form>
      )}
    </Flex>
  )
}
