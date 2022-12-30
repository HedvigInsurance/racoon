import { useCallback, useSyncExternalStore } from 'react'
import { ShopSession } from './ShopSession.types'

type ShopSessionStore = ShopSession | null
type ShopSessionStoreListener = (state: ShopSessionStore) => void
type ShopSessionSetState = (fun: (state: ShopSessionStore) => ShopSessionStore) => void

const createShopSessionStore = (initialState: ShopSessionStore) => {
  let state: ShopSessionStore = initialState
  const getState = () => state
  const listeners = new Set<ShopSessionStoreListener>()
  const setState: ShopSessionSetState = (fun) => {
    state = fun(state)
    listeners.forEach((listener) => listener(state))
  }
  const subscribe = (listener: ShopSessionStoreListener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  return { getState, setState, subscribe }
}

export const store = createShopSessionStore(null)

// fetch('/shop-session')
//   .then((response) => response.json())
//   .then((shopSession) => {
//     store.setState(() => shopSession)
//   })

type ExternalStore<State> = {
  subscribe: (listener: (state: State) => void) => () => void
  getState: () => State
}

export const useShopSessionStore = <State,>(
  store: ExternalStore<State>,
  selector: (state: State) => void,
) => {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
  )
}

// const Test = () => {
//   const shopSessionId = useShopSessionStore(store, (state) => state?.id)
// }
