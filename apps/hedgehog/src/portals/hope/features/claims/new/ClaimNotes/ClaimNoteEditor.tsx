import {
  Button,
  Flex,
  LegacyTooltip,
  PopupMenu,
  PopupMenuItem,
} from '@hedvig-ui/redesign'
import { theme } from '@hedvig-ui/redesign/theme'
import {
  convertEnumToTitle,
  extractErrorMessage,
  FadeIn,
  isPressing,
  Keys,
  Paragraph,
  Shadowed,
  useDraft,
  usePlatform,
} from '@hedvig-ui'
import { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import {
  ClaimNoteTag,
  ClaimNoteType,
  useAddClaimNoteMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { IconButton, TickIcon } from '@hedvig-ui/icons'
import { Pin, PinFill, Tag, TagFill } from 'react-bootstrap-icons'
import { NoteTags } from './NoteTags'
import { TiptapEditor } from './Tiptap'

export const ClaimNoteEditor = (props: {
  autoPin?: boolean
  onNoteCreated?: () => void
  autoFocus?: boolean
}) => {
  const { autoPin, onNoteCreated, autoFocus = false } = props

  const { claimId } = useClaim()
  const [createNote, { loading: creating }] = useAddClaimNoteMutation()
  const [note, setNote] = useDraft(`${claimId}-tiptap-json`)

  const [showSettings, setShowSettings] = useState(false)
  const [pin, setPin] = useState(false)
  const [tags, setTags] = useState<ClaimNoteTag[]>([])
  const [textFieldFocused, setTextFieldFocused] = useState(false)
  const [revision, setRevision] = useState(0)
  const { isMetaKey, metaKey } = usePlatform()

  const handleCreateNote = useCallback(async () => {
    const noteTags = [...tags]
    if (autoPin || pin) {
      noteTags.push(ClaimNoteTag.Pinned)
    }
    await toast.promise(
      createNote({
        variables: {
          claimId,
          note: { text: note, type: ClaimNoteType.TiptapJson, tags: noteTags },
        },
      }),
      {
        loading: 'Adding note...',
        success: 'Note added',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
    setNote('')
    setTags([])
    setPin(false)
    setRevision((prev) => prev + 1)
    onNoteCreated?.()
  }, [
    claimId,
    createNote,
    note,
    setNote,
    autoPin,
    tags,
    onNoteCreated,
    pin,
    setRevision,
  ])

  const handleOnKeyDown = async (e: React.KeyboardEvent) => {
    if (isMetaKey(e) && isPressing(e, Keys.Enter)) {
      await handleCreateNote()
    }
  }

  return (
    <EditorWrapper onKeyDown={handleOnKeyDown}>
      <TiptapEditor
        key={revision}
        autofocus={autoFocus}
        content={note ? JSON.parse(note) : null}
        onContentChange={(content) => {
          setNote(JSON.stringify(content))
        }}
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
        disabled={creating}
      />
      <SubNoteWrapper>
        <Flex gap={'tiny'} align={'center'}>
          <Button disabled={!note || creating} onClick={handleCreateNote}>
            {creating ? 'Saving...' : 'Add note'}
          </Button>
          {!autoPin && (
            <LegacyTooltip content={pin ? 'Unpin' : 'Pin'}>
              <IconButton onClick={() => setPin((prev) => !prev)}>
                {pin ? <PinFill /> : <Pin />}
              </IconButton>
            </LegacyTooltip>
          )}

          <PopupMenu
            position="topRight"
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            target={
              <LegacyTooltip content="Tags">
                <IconButton onClick={() => setShowSettings(true)}>
                  {tags.length ? <TagFill /> : <Tag />}
                </IconButton>
              </LegacyTooltip>
            }
          >
            <TagMenu
              tags={tags}
              onSelected={(tag) => {
                setTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag],
                )
              }}
            />
          </PopupMenu>
          <NoteTags tags={tags} />
        </Flex>
        {textFieldFocused && (
          <FadeIn duration={200}>
            <NoteTip>
              Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
              <Shadowed>Enter</Shadowed> to add note
            </NoteTip>
          </FadeIn>
        )}
      </SubNoteWrapper>
    </EditorWrapper>
  )
}

const TagMenu = (props: {
  tags: ClaimNoteTag[]
  onSelected: (tag: ClaimNoteTag) => void
}) => {
  const { tags, onSelected } = props
  return (
    <>
      {Object.values(ClaimNoteTag).map((tag) => {
        return (
          <PopupMenuItem key={tag} onClick={() => onSelected(tag)}>
            {convertEnumToTitle(tag)}
            {tags.includes(tag) && <TickIcon />}
          </PopupMenuItem>
        )
      })}
    </>
  )
}

const EditorWrapper = styled.div`
  border-radius: ${theme.space.md};
  border: solid 1px ${theme.colors.borderTranslucent1};
  padding: ${theme.space.md};
  background-color: ${theme.colors.white};
  cursor: auto;
`

const NoteTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${theme.colors.gray700};
  width: max-content;
`

const SubNoteWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
`
