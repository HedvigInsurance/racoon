type ForeverParams = { code?: string }

export const PageLink = {
  forever: ({ code }: ForeverParams) => (code ? `/forever?code=${code}` : '/forever'),
}
