import Draggable from 'react-draggable'
import { ClaimNoteEditor } from './ClaimNoteEditor'
import { Keys } from '@hedvig-ui'
import { Button, Div, Flex } from '@hedvig-ui/redesign'
import { CommandHotkey } from '@hope/features/commands/components/CommandHotkey'
import { noteEditorWrapper } from './DraggableNoteEditor.css'
import { IconButton, PlusIcon } from '@hedvig-ui/icons'
import { XLg } from 'react-bootstrap-icons'
import { atom, useAtom } from 'jotai'

export const draggableNoteEditorVisibleAtom = atom(false)

export const DraggableNoteEditor = () => {
  const [isVisible, setIsVisible] = useAtom(draggableNoteEditorVisibleAtom)

  return (
    <div style={{ position: 'relative' }}>
      <CommandHotkey
        text="New Note"
        keys={[Keys.Option, Keys.N]}
        onResolve={() => setIsVisible(!isVisible)}
      >
        <Button variant="secondary" onClick={() => setIsVisible(!isVisible)}>
          <PlusIcon /> New note
        </Button>
      </CommandHotkey>
      {isVisible && (
        <Draggable>
          <Div className={noteEditorWrapper}>
            <Flex justify="space-between" align="center" pl="small">
              <span>Add new note</span>

              <IconButton onClick={() => setIsVisible(false)}>
                <XLg />
              </IconButton>
            </Flex>
            <ClaimNoteEditor
              onNoteCreated={() => setIsVisible(false)}
              autoFocus={true}
            />
          </Div>
        </Draggable>
      )}
    </div>
  )
}
