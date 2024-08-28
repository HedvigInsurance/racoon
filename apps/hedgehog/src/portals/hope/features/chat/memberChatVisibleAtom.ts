import { atomWithStorage } from 'jotai/utils'

export const memberChatVisibleAtom = atomWithStorage(
  'hvg:non-task-chat-visible:v2',
  false,
)
