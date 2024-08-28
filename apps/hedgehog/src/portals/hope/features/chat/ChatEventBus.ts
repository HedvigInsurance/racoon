let nextListenerId = 1
const listeners = new Map<string, Map<string, () => void>>()

export type ChatEventBusUnsubscribe = () => void

export const ChatEventBus = {
  onMessageSent: (
    conversationId: string,
    handler: () => void,
  ): ChatEventBusUnsubscribe => {
    const key = `onMessageSent:${conversationId}`
    let listenersForKey = listeners.get(key)
    if (!listenersForKey) {
      listenersForKey = new Map<string, () => void>()
      listeners.set(key, listenersForKey)
    }

    const listenerId = (nextListenerId++).toString()
    listenersForKey.set(listenerId, handler)

    return () => listenersForKey!.delete(listenerId)
  },

  notifyMessageSent: (conversationId: string) => {
    const key = `onMessageSent:${conversationId}`
    const listenersForKey = listeners.get(key)
    listenersForKey?.forEach((handler) => {
      handler()
    })
  },
}
