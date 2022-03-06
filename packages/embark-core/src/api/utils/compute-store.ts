import { EmbarkHistory, Store } from './../types'

import { JSONStory } from '@/angel/types'
import { angel } from '@/angel/index'
import { convertHistoryToStore } from './convert-history-to-store'
import { evaluateComputedValues } from './evaluate-computed-values'

type ComputeStoreParams = {
  story: JSONStory
  history: EmbarkHistory
}

export const computeStore = ({ story, history }: ComputeStoreParams): Store => {
  const userStore = convertHistoryToStore(history)

  const values = angel.parseComputedValues(story.computedStoreValues)
  const computedStore = evaluateComputedValues({ store: userStore, values })

  return {
    ...userStore,
    ...computedStore,
  }
}
