import { graphqlSdk } from '@/services/graphql/sdk'

export type ShopSession = Awaited<
  ReturnType<typeof graphqlSdk.ShopSessionFindOrCreate>
>['shopSessionFindOrCreate']
