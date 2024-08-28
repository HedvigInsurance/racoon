import {
  Button,
  CardContent,
  CardTitle,
  FadeIn,
  isPressing,
  Keys,
  Paragraph,
  Shadowed,
  TextArea,
  useDraft,
  usePlatform,
} from '@hedvig-ui'
import { useState } from 'react'
import styled from '@emotion/styled'
import { useCreateClaimNote } from '@hope/features/claims/claim-details/ClaimNotes/use-create-claim-note'
import { ClaimNoteItem } from '@hope/features/claims/claim-details/ClaimNotes/ClaimNoteItem'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimNoteType } from 'types/generated/graphql'

const NoteTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const SubNoteWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
`

const NotesCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ClaimNotes = () => {
  const { claimId, notes } = useClaim()
  const { createNote, creating } = useCreateClaimNote()
  const [note, setNote] = useDraft(claimId)

  const { isMetaKey, metaKey } = usePlatform()

  const [textFieldFocused, setTextFieldFocused] = useState(false)

  return (
    <NotesCardContent>
      <CardTitle title="Notes" />
      {notes.map((note) => (
        <ClaimNoteItem key={note.id} note={note} />
      ))}
      <TextArea
        resize
        placeholder="Your note goes here..."
        value={creating ? '' : note}
        onChange={(e) => setNote(e.currentTarget.value)}
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
        onKeyDown={(e) => {
          if (isMetaKey(e) && isPressing(e, Keys.Enter) && !creating && note) {
            createNote(claimId, note, ClaimNoteType.Text).then(() =>
              setNote(''),
            )
          }
        }}
      />
      <SubNoteWrapper>
        <Button
          disabled={!note || creating}
          onClick={() => {
            createNote(claimId, note, ClaimNoteType.Text).then(() =>
              setNote(''),
            )
          }}
        >
          Add note
        </Button>
        {textFieldFocused && (
          <FadeIn duration={200}>
            <NoteTip>
              Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
              <Shadowed>Enter</Shadowed> to add note
            </NoteTip>
          </FadeIn>
        )}
      </SubNoteWrapper>
    </NotesCardContent>
  )
}

export { ClaimNotes }
