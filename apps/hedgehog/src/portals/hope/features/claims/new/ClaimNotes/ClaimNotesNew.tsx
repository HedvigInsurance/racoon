import { convertEnumToTitle } from '@hedvig-ui'
import { useMemo, useState } from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimNoteEditor } from './ClaimNoteEditor'
import { ClaimNoteItemNew } from './ClaimNoteItemNew'
import { Card, Dropdown, Flex, Grid, Input } from '@hedvig-ui/redesign'
import { ClaimNoteFragment, ClaimNoteTag } from 'types/generated/graphql'
import { useAtomValue } from 'jotai'
import { draggableNoteEditorVisibleAtom } from './DraggableNoteEditor'

export const ClaimNotesNew = () => {
  const { notes } = useClaim()

  const [filterText, setFilterText] = useState('')
  const [selectedTag, setSelectedTag] = useState<ClaimNoteTag>()

  const tags = useMemo(() => {
    return Array.from(new Set(notes.flatMap((note) => note.tags))).map(
      (tag) => ({
        label: convertEnumToTitle(tag),
        value: tag,
        selected: selectedTag === tag,
        action: () => {
          setSelectedTag(tag)
        },
      }),
    )
  }, [notes, selectedTag])

  const filteredNotes = useMemo(() => {
    if (!filterText && !selectedTag) {
      return notes
    }

    const regex = filterText ? noteFilterRegex(filterText, 'i') : null
    return notes.filter((note) => {
      const textMatch = regex?.test(note.text) ?? true
      const tagMatch = !selectedTag || note.tags.includes(selectedTag)
      return textMatch && tagMatch
    })
  }, [notes, selectedTag, filterText])

  const pinnedNotes = notes.filter((note) =>
    note.tags.includes(ClaimNoteTag.Pinned),
  )
  const draggableNoteEditorVisible = useAtomValue(
    draggableNoteEditorVisibleAtom,
  )

  return (
    <Flex direction="column" gap="small">
      <Card>
        <Grid equalColumns={2} gap={'medium'}>
          <Input
            autoFocus
            type={'text'}
            placeholder={'Search in notes...'}
            onChange={(e) => setFilterText(e.currentTarget.value)}
          />
          <Dropdown
            label={'Filter by tag'}
            options={[
              {
                label: 'Unselect all tags',
                value: '',
                selected: false,
                action: () => setSelectedTag(undefined),
              },
              ...tags,
            ]}
          />
        </Grid>
      </Card>

      <NoteList notes={pinnedNotes} highlight={filterText} />

      <NoteList notes={filteredNotes} highlight={filterText} />

      {!draggableNoteEditorVisible && <ClaimNoteEditor />}
    </Flex>
  )
}

const NoteList = ({
  notes,
  highlight,
}: {
  notes: ClaimNoteFragment[]
  highlight: string | undefined
}) => {
  if (!notes.length) {
    return null
  }
  return (
    <Card>
      {notes.map((note) => (
        <ClaimNoteItemNew key={note.id} note={note} highlight={highlight} />
      ))}
    </Card>
  )
}

export const noteFilterRegex = (searchString: string, flags: string) => {
  return new RegExp(
    // escape the searchString value to let it become a regexp
    // https://stackoverflow.com/a/6969486
    `(${searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    flags,
  )
}
