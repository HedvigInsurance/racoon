type ForeverParams = { code?: string }

export const PageLink = {
  forever: ({ code }: ForeverParams) => (code ? `/new/forever?code=${code}` : '/forever'),
}
