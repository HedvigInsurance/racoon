import { atom } from 'jotai'
import { ChatMessage } from './messages/useChatMessages'

const isForwardingActiveAtom = atom(false)

const messagesToForwardAtom = atom<ChatMessage[]>([])

export const ConversationState = {
  isForwardingActiveAtom,
  messagesToForwardAtom,
}
