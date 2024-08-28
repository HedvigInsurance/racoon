import { useSetAtom } from 'jotai'
import { memberChatVisibleAtom } from '@hope/features/chat/memberChatVisibleAtom'
import { CommandHotkey } from '@hope/features/commands/components/CommandHotkey'
import { Button, Keys } from '@hedvig-ui'

export const ToggleMemberChatButton = () => {
  const setVisible = useSetAtom(memberChatVisibleAtom)
  const toggleMemberChat = () => {
    setVisible((value) => !value)
  }
  return (
    <CommandHotkey
      text="Toggle Chat"
      keys={[Keys.Option, Keys.C]}
      onResolve={toggleMemberChat}
      side="right"
    >
      <Button variant="secondary" onClick={toggleMemberChat}>
        Chat
      </Button>
    </CommandHotkey>
  )
}
