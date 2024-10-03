import { type ApolloClient } from '@apollo/client'
import { isBrowser } from '@/utils/env'
import { SendEventBatchDocument } from '../graphql/generated'
import { type TrackingEvent } from './TrackingEvent'

export type InternalEvent = {
  id: string
  type: TrackingEvent
  data: unknown
  clientTimestamp: string
}

export class InternalEventReporter {
  #queue: Array<InternalEvent> = []

  enqueue(type: TrackingEvent, data: unknown) {
    if (!isBrowser()) {
      throw new Error('InternalEventReporter must be used client-side')
    }
    // Ignore few ancient browsers, universal support for randomUUID appeared in 2021
    if (typeof crypto.randomUUID !== 'function') {
      console.log('crypto.randomUUID not supported, skipping internal event reporting')
    }
    this.#queue.push({
      id: crypto.randomUUID(),
      type,
      data,
      clientTimestamp: new Date().toISOString(),
    })
  }

  async flush(apolloClient: ApolloClient<unknown>, shopSessionId: string) {
    if (!isBrowser()) {
      throw new Error('InternalEventReporter must be used client-side')
    }
    if (this.#queue.length === 0) {
      return
    }
    const inputList = this.#queue.map((item) => ({
      ...item,
      sessionId: shopSessionId,
    }))
    try {
      await apolloClient.mutate({
        mutation: SendEventBatchDocument,
        variables: { inputList },
      })
      this.#queue = []
    } catch (err) {
      console.log('Failed to send internal events, keeping them in queue', err)
    }
  }
}
