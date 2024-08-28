import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimNoteTag } from 'types/generated/graphql'
import { ClaimNoteEditor } from '@hope/features/claims/new/ClaimNotes/ClaimNoteEditor'
import { ClaimNoteItemNew } from '@hope/features/claims/new/ClaimNotes/ClaimNoteItemNew'

export const ClaimInformationNotes = () => {
  const { notes } = useClaim()
  const pinnedNotes = notes.filter((note) =>
    note?.tags?.includes(ClaimNoteTag.Pinned),
  )

  if (!pinnedNotes.length) {
    return <ClaimNoteEditor autoPin />
  }

  return (
    <div>
      {pinnedNotes.map((note) => (
        <ClaimNoteItemNew key={note.id} note={note} />
      ))}
    </div>
  )
}
