import { useShopSessionSuspenseQuery } from '@/services/graphql/generated'

export function useShopSessionSuspense({ shopSessionId }: { shopSessionId: string }) {
  // TODO: ideally we want to continue to use `useShopSession` from `ShopSessionContext` here but first we need
  // to change it so it uses React Suspense.
  const {
    data: { shopSession },
  } = useShopSessionSuspenseQuery({ variables: { shopSessionId } })

  return shopSession
}
