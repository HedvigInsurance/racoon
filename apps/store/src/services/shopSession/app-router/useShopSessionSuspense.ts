import { useShopSessionSuspenseQuery } from '@/services/graphql/generated'

type Options = Omit<NonNullable<Parameters<typeof useShopSessionSuspenseQuery>[0]>, 'variables'>

export function useShopSessionSuspense({
  shopSessionId,
  options,
}: {
  shopSessionId: string
  options?: Options
}) {
  // TODO: ideally we want to continue to use `useShopSession` from `ShopSessionContext` here but first we need
  // to change it so it uses React Suspense.
  const {
    data: { shopSession },
  } = useShopSessionSuspenseQuery({ variables: { shopSessionId }, ...options })

  return shopSession
}
