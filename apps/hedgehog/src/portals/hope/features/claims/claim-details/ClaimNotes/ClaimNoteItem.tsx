import { format, parseISO } from 'date-fns'
import styled from '@emotion/styled'
import { Paragraph } from '@hedvig-ui'
import { ClaimNoteFragment, ClaimNoteType } from 'types/generated/graphql'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { richText } from '@hope/features/claims/new/ClaimNotes/richText.css'
import { TiptapView } from '@hope/features/claims/new/ClaimNotes/Tiptap'

const NoteItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`

const NoteText = styled(Paragraph)`
  margin: 0;
  white-space: pre-wrap;
`

const NoteCreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: ${({ theme }) => theme.placeholderColor};
`

const remarkPlugins = [remarkBreaks]

export const ClaimNoteItem = ({
  note: { text, type, insertedBy, insertedAt },
}: {
  note: ClaimNoteFragment
}) => {
  return (
    <NoteItem>
      {type === ClaimNoteType.TiptapJson ? (
        <TiptapView content={JSON.parse(text)}></TiptapView>
      ) : type === ClaimNoteType.Markdown ? (
        <div className={richText}>
          <Markdown remarkPlugins={remarkPlugins}>{text}</Markdown>
        </div>
      ) : (
        <NoteText>{text}</NoteText>
      )}
      <NoteCreatorInfo>
        <span>{formatInsertedBy(insertedBy)}</span>
        <span>{format(parseISO(insertedAt), 'yyyy-MM-dd HH:mm:ss')}</span>
      </NoteCreatorInfo>
    </NoteItem>
  )
}

const formatInsertedBy = (insertedBy: ClaimNoteFragment['insertedBy']) => {
  switch (insertedBy?.__typename) {
    case 'AdminSystemUser':
    case 'EmailSystemUser':
      return insertedBy.email
    case 'UnknownSystemUser':
      return insertedBy.name
    default:
      return 'Automation'
  }
}
