import { ReactNode, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'

export const Portal = ({ children }: { children: ReactNode }) => {
  const portalRoot = useMemo(() => document.getElementById('portal-root'), [])
  const element = useMemo(() => document.createElement('div'), [])

  useEffect(() => {
    portalRoot?.appendChild(element)

    return () => {
      portalRoot?.removeChild(element)
    }
  }, [element, portalRoot])

  return ReactDOM.createPortal(<>{children}</>, element)
}
