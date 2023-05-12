import { isApolloError } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { SbBlokData } from '@storyblok/js/dist/types/types'
import {
  ISbStoryData,
  StoryblokComponent,
  storyblokEditable,
  useStoryblokState,
} from '@storyblok/react'
import Head from 'next/head'
import { FormEventHandler, useCallback, useMemo } from 'react'
import { Button } from 'ui'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import {
  ProductOffer,
  useManyPetsFillCartMutation,
  useManyPetsMigrationOffersQuery,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'

const manypetsLogger = datadogLogs.createLogger('manypets')

// TODO: Figure out correct way to reuse types between this module and pages/manypets/migration/
type MigrationPageStory = ISbStoryData<{
  preOfferContent?: Array<SbBlokData>
  postOfferContent: Array<SbBlokData>
}>
export type ManyPetsMigrationPageProps = {
  className?: string
  [STORY_PROP_NAME]: MigrationPageStory
}

const EMPTY_OFFERS: ProductOffer[] = []

export const ManyPetsMigrationPage = (props: ManyPetsMigrationPageProps) => {
  const { shopSession } = useShopSession()
  if (!shopSession) {
    throw new Error('Must have shopSession at this point')
  }

  const queryResult = useManyPetsMigrationOffersQuery({
    variables: { shopSessionId: shopSession.id },
  })

  const offers = queryResult.data?.petMigrationOffers ?? EMPTY_OFFERS
  const offerIds = offers.map((offer) => offer.id)
  const cartEntries = useMemo(() => offers.map(getCartEntry), [offers])

  const { handleSubmitSign, loading } = useSignMigration(shopSession, offerIds)

  const story: MigrationPageStory = useStoryblokState(props.story)

  let offersSection = <>Loading...</>
  if (!queryResult.loading) {
    if (offers.length > 0) {
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
    <>
      <Head>
        <title>TODO: Take from CMS</title>
        <meta name="robots" content="none" />
      </Head>
      <GridLayout.Root className={props.className}>
        <GridLayout.Content width="1/2" align="center">
          {story.content.preOfferContent?.map((blok) => (
            <StoryblokComponent key={blok._uid} blok={blok} {...storyblokEditable(blok)} />
          ))}

          {offersSection}

          {story.content.postOfferContent.map((blok) => (
            <StoryblokComponent key={blok._uid} blok={blok} {...storyblokEditable(blok)} />
          ))}
        </GridLayout.Content>
      </GridLayout.Root>
    </>
  )
}

const useSignMigration = (
  shopSession: Pick<ShopSession, 'id' | 'customer' | 'cart'>,
  offerIds: Array<string>,
) => {
  const { currentOperation, startCheckoutSign } = useBankIdContext()
  const { showError } = useAppErrorHandleContext()

  const [fillCart, fillCartResult] = useManyPetsFillCartMutation()

  const handleSubmitSign: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
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
          onSuccess() {
            window.alert('Sign success, time to implement next steps!')
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
    [shopSession, startCheckoutSign, fillCart, offerIds, showError],
  )

  const signLoading = [BankIdState.Starting, BankIdState.Pending, BankIdState.Success].includes(
    currentOperation?.state as BankIdState,
  )

  return { handleSubmitSign, loading: fillCartResult.loading || signLoading }
}
