import { EmbarkHistory, Store } from '../types'

export const convertHistoryToStore = (history: EmbarkHistory): Store =>
  history.reduce((acc, item) => {
    return { ...acc, ...item.storeDiff }
  }, {})
