import { useClaim } from 'portals/hope/features/claims/hooks/use-claim'
import { ClaimNoteTag } from 'types/generated/graphql'
import { Card, Grid } from '@hedvig-ui/redesign'
import { ClaimNoteItemNew } from 'portals/hope/features/claims/new/ClaimNotes/ClaimNoteItemNew'

export const ClaimPayoutNotes = () => {
  const { notes } = useClaim()

  const paymentNotes = notes.filter((note) =>
    note.tags.includes(ClaimNoteTag.PayoutInfo),
  )
  const hasPaymentNotes = paymentNotes.length > 0

  if (!hasPaymentNotes) {
    return null
  }

  return (
    <Card>
      <p>Payout Notes</p>
      <Grid>
        {paymentNotes.map((note) => (
          <ClaimNoteItemNew key={note.id} note={note} />
        ))}
      </Grid>
    </Card>
  )
}
