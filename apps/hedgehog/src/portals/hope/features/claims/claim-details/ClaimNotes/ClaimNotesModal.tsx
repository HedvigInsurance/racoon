import styled from '@emotion/styled'
import {
  Hint,
  isPressing,
  Keys,
  SidebarModal,
  TextArea,
  useDraft,
} from '@hedvig-ui'
import * as React from 'react'
import { useCreateClaimNote } from './use-create-claim-note'
import { ClaimNoteItem } from '@hope/features/claims/claim-details/ClaimNotes/ClaimNoteItem'
import { useClaim } from '../../hooks/use-claim'
import { ClaimNoteType } from 'types/generated/graphql'

const NotesList = styled.div`
  padding: 15px;
  flex: 1;
  overflow-y: auto;
`

const Form = styled.div`
  padding: 20px 15px;

  & label {
    margin: 0;
  }
`

const Hotkeys = styled.div`
  position: relative;
  height: 1.5rem;
  margin-top: 10px;
`

const HotkeyHint = styled(Hint)`
  bottom: 0 !important;
  left: 0 !important;
  padding: 0 !important;
`

export const ClaimNotesModal: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { claimId, notes } = useClaim()
  const { createNote, creating } = useCreateClaimNote()
  const [note, setNote] = useDraft(claimId)

  const keyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPressing(e, Keys.Escape) || (e.altKey && isPressing(e, Keys.Q))) {
      e.preventDefault()
      onClose()
      return
    }

    if (!note || creating) {
      return
    }

    if (e.metaKey && isPressing(e, Keys.Enter)) {
      createNote(claimId, note, ClaimNoteType.Text).then(() => setNote(''))
    }
  }

  return (
    <SidebarModal title="Claim Notes" onClose={onClose}>
      <NotesList>
        {notes.map((note) => (
          <ClaimNoteItem key={note.id} note={note} />
        ))}
      </NotesList>
      <Form>
        <TextArea
          autoFocus
          value={note}
          style={{ height: 100 }}
          placeholder="Note goes here"
          onKeyDown={keyDownHandler}
          onChange={({ currentTarget: { value } }) => setNote(value)}
        />
        <Hotkeys>
          <HotkeyHint
            variant="secondary"
            textPosition="right"
            text="to add"
            keys={[Keys.Command, Keys.Enter]}
          />
        </Hotkeys>
      </Form>
    </SidebarModal>
  )
}
