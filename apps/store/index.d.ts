import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

type PageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

declare module 'next' {
  export type NextPageWithLayout<T = {}> = PageWithLayout<T>
}

declare module 'next/app' {
  export type AppPropsWithLayout = AppProps & {
    Component: PageWithLayout
  }
}
