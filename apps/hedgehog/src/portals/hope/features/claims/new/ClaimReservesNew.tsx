import {
  Button,
  Card,
  Flex,
  Grid,
  Hr,
  Input,
  LabeledText,
  OrbIndicator,
} from '@hedvig-ui/redesign'
import { useClaim } from '../hooks/use-claim'
import { convertEnumToTitle, formatMoney } from '@hedvig-ui'
import {
  ClaimNoteType,
  ClaimSubclaimFragment,
  ReserveNote,
  SystemUser,
} from 'types/generated/graphql'
import { FormEventHandler, useState } from 'react'
import { ClaimState } from '../../config/constants'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import { useCreateClaimNote } from '../claim-details/ClaimNotes/use-create-claim-note'
import { formatDate } from 'date-fns/format'

export const ClaimReservesNew = () => {
  const { subclaims } = useClaim()
  const relevantSubclaims = subclaims.filter(({ type }) => !!type)

  return (
    <Flex direction="column" gap="small" align="stretch">
      {relevantSubclaims.map((subclaim) => (
        <Reserve key={subclaim.id} subclaim={subclaim} />
      ))}
    </Flex>
  )
}

const Reserve = ({ subclaim }: { subclaim: ClaimSubclaimFragment }) => {
  const { claimId, claimState } = useClaim()
  const { setReserve } = useSetSubclaimReserve()
  const { createNote } = useCreateClaimNote()

  const [formRevision, setFormRevision] = useState(0)
  const reserveStatus = getReserveStatus(
    subclaim.reserve.amount,
    claimState as ClaimState,
  )

  const totalReserve = {
    amount: subclaim.reserves.reduce(
      (acc, reserve) => acc + reserve.amount.amount,
      0,
    ),
    currency: subclaim.reserve.currency as string,
  }
  const reserveNotes = subclaim.reserves.flatMap((r) => r.notes)
  const sortedNotes = reserveNotes.toSorted(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData(event.currentTarget)
      const reserve = parseInt(formData.get('reserve')!.toString())
      const note = formData.get('note')?.toString()

      await setReserve(
        subclaim.id,
        subclaim.reserves,
        { amount: reserve, currency: subclaim.reserve.currency },
        undefined,
        note,
      )

      if (note) {
        await createNote(claimId, note, ClaimNoteType.Text)
      }

      setFormRevision((prev) => prev + 1)
    } catch {
      return
    }
  }

  return (
    <Card key={subclaim.id}>
      <form onSubmit={handleSubmit} key={formRevision}>
        <Flex direction="column" gap="small" align="stretch">
          <Flex align="center" gap="tiny">
            <OrbIndicator status={reserveStatus} />
            {convertEnumToTitle(subclaim.type!)}
          </Flex>

          <Hr />

          <Grid equalColumns={2} gap="lg">
            <Flex direction="column" gap="small">
              <LabeledText label="Reserve">
                {formatMoney(totalReserve)}
              </LabeledText>

              <Input
                label="Update..."
                affix={{ content: totalReserve.currency }}
                name="reserve"
                type="number"
                required
              />

              <Input label="Note" name="note" />

              <Flex gap="small">
                <Button type="submit">Save</Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setFormRevision((prev) => prev + 1)}
                >
                  Reset form
                </Button>
              </Flex>
            </Flex>

            <Flex direction="column">
              {sortedNotes.map((note) => (
                <LabeledText label={formatNoteCreator(note)}>
                  {note.text}
                </LabeledText>
              ))}
            </Flex>
          </Grid>
        </Flex>
      </form>
    </Card>
  )
}

const formatNoteCreator = (note: ReserveNote) => {
  return `${formatDate(note.timestamp, 'y-MM-dd')} by ${formatAuthor(note.author)}`
}

const getReserveStatus = (reserve: number, claimState: ClaimState) => {
  switch (claimState) {
    case ClaimState.Closed:
      return reserve > 0 ? 'danger' : 'success'
    case ClaimState.Open:
    case ClaimState.Reopened:
      return reserve > 0 ? 'success' : 'warning'
    default:
      return 'neutral'
  }
}

const formatAuthor = (author: SystemUser | null | undefined) => {
  switch (author?.__typename) {
    case 'AdminSystemUser':
    case 'EmailSystemUser':
      return author.email
    case 'UnknownSystemUser':
      return author.name
    default:
      return 'automation'
  }
}
