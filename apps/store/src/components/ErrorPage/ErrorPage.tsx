import type { ReactNode } from 'react'
import { contentWrapper } from './ErrorPage.css'

type Props = { children: ReactNode }

export const ErrorPage = ({ children }: Props) => {
  return <div className={contentWrapper}>{children}</div>
}
