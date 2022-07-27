const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (GRAPHQL_ENDPOINT === undefined) throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined')

export const graphqlConstants = () => ({
  GRAPHQL_ENDPOINT,
})

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
