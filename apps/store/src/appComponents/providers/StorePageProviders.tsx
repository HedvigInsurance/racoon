import { Provider as JotaiProvider } from 'jotai'
import { type ReactNode } from 'react'

// TODO: Add more providers we want to keep outside of layout. For example, StoryblokProvider can be moved here
export function StorePageProviders({ children }: { children: ReactNode }) {
  // JotaiProvider ensures we don't carry over jotai atom values between navigations
  // This prevents all sorts of bugs and allows us to treat readonly page-specific atoms as constant
  // We have another `JotaiProvider` in root layout, but that one is retained during navigation
  return <JotaiProvider>{children}</JotaiProvider>
}
