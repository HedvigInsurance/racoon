import { isApolloError, useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { FormEventHandler, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { Button } from 'ui'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import {
  fetchCheckoutSteps,
  getCheckoutStepLink,
} from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import {
  ProductOffer,
  useManyPetsFillCartMutation,
  useManyPetsMigrationOffersQuery,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

const manypetsLogger = datadogLogs.createLogger('manypets')

type ManyPetsMigrationPageProps = {
  preOfferContent?: ReactNode
  postOfferContent: ReactNode
}

const EMPTY_OFFERS: ProductOffer[] = []

export const ManyPetsMigrationPage = ({
  preOfferContent,
  postOfferContent,
}: ManyPetsMigrationPageProps) => {
  const { shopSession } = useShopSession()

  const queryResult = useManyPetsMigrationOffersQuery({
    variables: { shopSessionId: shopSession?.id ?? '' },
    skip: !shopSession?.id,
  })

  const offers = queryResult.data?.petMigrationOffers ?? EMPTY_OFFERS
  const offerIds = offers.map((offer) => offer.id)
  const cartEntries = useMemo(() => offers.map(getCartEntry), [offers])

  const { handleSubmitSign, loading } = useSignMigration(shopSession, offerIds)

  let offersSection = <>Loading...</>
  if (!queryResult.loading) {
    if (shopSession && offers.length > 0) {
      offersSection = (
        <>
          <CartEntryList>
            {cartEntries.map((item) => (
              <CartEntryItem
                key={item.offerId}
                shopSessionId={shopSession.id}
                defaultOpen={false}
                readOnly={true}
                {...item}
              />
            ))}
          </CartEntryList>
          <form onSubmit={handleSubmitSign} style={{ marginBlock: '1rem' }}>
            <Button type="submit" loading={loading}>
              SIGN IT!
            </Button>
          </form>
        </>
      )
    } else {
      // TODO: Show something relevant or crash
      offersSection = <div>No offers</div>
    }
  }

  return (
    <main>
      {preOfferContent}
      {offersSection}
      {postOfferContent}
    </main>
  )
}

const useSignMigration = (
  shopSession: Pick<ShopSession, 'id' | 'customer' | 'cart'> | undefined,
  offerIds: Array<string>,
) => {
  const { currentOperation, startCheckoutSign } = useBankIdContext()
  const { showError } = useAppErrorHandleContext()
  const router = useRouter()
  const apolloClient = useApolloClient()

  const [fillCart, fillCartResult] = useManyPetsFillCartMutation()

  const handleSubmitSign: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      if (!shopSession) return

      event.preventDefault()

      if (!shopSession.customer || !shopSession.customer.ssn) {
        throw new Error('Must have customer data and ssn in it')
      }

      const shopSessionId = shopSession.id
      try {
        if (shopSession.cart.entries.length === 0) {
          manypetsLogger.debug('Cart is empty, filling it with migration offers')
          await fillCart({ variables: { shopSessionId, offerIds } })
        } else {
          const cartOfferIds = new Set(shopSession.cart.entries.map((entry) => entry.id))
          if (
            offerIds.length === shopSession.cart.entries.length &&
            offerIds.every((id) => cartOfferIds.has(id))
          ) {
            manypetsLogger.debug('Cart already filled with expected offers')
          } else {
            throw new Error(
              `Cart has unexpected items in it. cartOfferIds=${Array.from(
                cartOfferIds.values(),
              )}, migration offerIds=${offerIds}`,
            )
          }
        }

        const { authenticationStatus: customerAuthenticationStatus, ssn } = shopSession.customer
        startCheckoutSign({
          customerAuthenticationStatus,
          shopSessionId,
          ssn,
          async onSuccess() {
            const checkoutSteps = await fetchCheckoutSteps({ apolloClient, shopSession })
            const checkoutStepIndex = checkoutSteps.findIndex(
              (item) => item === CheckoutStep.Checkout,
            )
            const nextCheckoutStep = checkoutSteps[checkoutStepIndex + 1]

            setupShopSessionServiceClientSide(apolloClient).reset()

            await router.push(getCheckoutStepLink({ step: nextCheckoutStep, shopSessionId }))
          },
        })
      } catch (err) {
        if (err instanceof Error && !isApolloError(err)) {
          manypetsLogger.error('Error filling migration cart', { shopSessionId }, err)
        }
        showError(err as Error)
        return
      }
    },
    [shopSession, startCheckoutSign, fillCart, offerIds, apolloClient, router, showError],
  )

  useEffect(() => {
    if (currentOperation?.error) {
      // Workaround for getting userError: {message: "Konflict."}} when trying to sign
      showError(new Error('Signing failed'))
    }
  }, [currentOperation?.error, showError])

  const signLoading = [BankIdState.Starting, BankIdState.Pending, BankIdState.Success].includes(
    currentOperation?.state as BankIdState,
  )

  return { handleSubmitSign, loading: fillCartResult.loading || signLoading }
}
