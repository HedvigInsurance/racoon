import { ApolloProvider } from '@apollo/client'
import { RenderOptions, render } from '@testing-library/react'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { NextRouter } from 'next/router'
import { ReactElement, ReactNode } from 'react'
import { createApolloClient } from '@/services/apollo'

const createRouterMock = (router?: Partial<NextRouter>): NextRouter =>
  ({
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: () => Promise.resolve(true),
    replace: () => Promise.resolve(true),
    reload: () => {},
    back: () => {},
    prefetch: () => Promise.resolve(),
    beforePopState: () => {},
    events: {
      on: () => {},
      off: () => {},
      emit: () => {},
    },
    isFallback: false,
    isLocaleDomain: false,
    isPreview: false,
    isReady: false,
    ...router,
  } as NextRouter)

const apolloClient = createApolloClient()

const AllTheProviders =
  ({ router }: { router?: Partial<NextRouter> }) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => {
    return (
      <ApolloProvider client={apolloClient}>
        <RouterContext.Provider value={createRouterMock(router)}>{children}</RouterContext.Provider>
      </ApolloProvider>
    )
  }

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { router?: Partial<NextRouter> },
) => render(ui, { wrapper: AllTheProviders({ router: options?.router }), ...options })

export * from '@testing-library/react'
export { customRender as render }
