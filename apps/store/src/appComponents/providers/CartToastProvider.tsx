'use client'

import { atom, useAtom } from 'jotai'
import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react'

const DEFAULT_DURATION = 3500

const showCartToastAtom = atom(false)

type Value = [show: boolean, showCartToast: (duration?: number) => void]

const CartToastContext = createContext<Value>([false, () => {}])

// This is a workaround so we can ship new cart toast along with the old one.
// Ideally we can get its "show" by listening to changes to the shop session, meaning show
// it whenever cart entries increase. We can't do that at the moment though as we'd be
// showing 2 cart toasts at the same time for old price calculator flows.
export function CartToastProvider({ children }: { children: ReactNode }) {
  const value = useCartToastValue()

  return <CartToastContext.Provider value={value}>{children}</CartToastContext.Provider>
}

function useCartToastValue(): Value {
  const timeoutId = useRef<number | null>(null)
  const [show, setShow] = useAtom(showCartToastAtom)

  const showCartToast = useCallback(
    (duration = DEFAULT_DURATION) => {
      setShow(true)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = window.setTimeout(() => setShow(false), duration)
    },
    [setShow],
  )

  return [show, showCartToast]
}

export function useCartToast() {
  return useContext(CartToastContext)
}
