import { SbBlokData } from '@storyblok/js/dist/types/types'
import {
  ISbStoryData,
  StoryblokComponent,
  storyblokEditable,
  useStoryblokState,
} from '@storyblok/react'
import Head from 'next/head'
import { FormEventHandler, useCallback } from 'react'
import { Button, Heading, Space } from 'ui'
import {
  useManyPetsFillCartMutation,
  useManyPetsMigrationOffersQuery,
} from '@/services/apollo/generated'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'

// TODO: Figure out correct way to reuse types between this module and pages/manypets/migration/
type MigrationPageStory = ISbStoryData<{
  preOfferContent?: Array<SbBlokData>
  postOfferContent: Array<SbBlokData>
}>
export type ManyPetsMigrationPageProps = {
  className?: string
  [STORY_PROP_NAME]: MigrationPageStory
}

export const ManyPetsMigrationPage = (props: ManyPetsMigrationPageProps) => {
  const { shopSession } = useShopSession()
  if (!shopSession) {
    throw new Error('Must have shopSession at this point')
  }

  const queryResult = useManyPetsMigrationOffersQuery({
    variables: { shopSessionId: shopSession.id },
  })

  const offers = queryResult.data?.petMigrationOffers ?? []
  const offerIds = offers.map((offer) => offer.id)
  const { handleSubmitSign, loading } = useSignMigration(shopSession, offerIds)

  const story: MigrationPageStory = useStoryblokState(props.story)

  return (
    <>
      <Head>
        <title>TODO: Take from CMS</title>
        <meta name="robots" content="none" />
      </Head>
      <div className={props.className}>
        <Heading variant="serif.40" as="h1">
          Pet Migration page 🐈‍ 🐩
        </Heading>
        <Space>
          {story.content.preOfferContent?.map((blok) => (
            <StoryblokComponent key={blok._uid} blok={blok} {...storyblokEditable(blok)} />
          ))}

          <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
            {queryResult.loading && 'Loading...'}

            {offers.map((offer) => (
              <pre
                key={offer.id}
                style={{
                  whiteSpace: 'pre',
                  fontFamily: 'monospace',
                  margin: '1rem 0',
                  borderTop: 'solid 1px gray',
                }}
              >
                {JSON.stringify(offer, null, 2)}
              </pre>
            ))}
          </div>
        </Space>

        {offerIds.length > 0 && (
          <form onSubmit={handleSubmitSign}>
            <Space>
              <Button type="submit" loading={loading}>
                SIGN IT!
              </Button>
            </Space>
          </form>
        )}

        {story.content.postOfferContent.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} {...storyblokEditable(blok)} />
        ))}
      </div>
    </>
  )
}

// TODO:
// - Extract and handle errors
const useSignMigration = (
  shopSession: Pick<ShopSession, 'id' | 'customer' | 'cart'>,
  offerIds: Array<string>,
) => {
  const { currentOperation, startCheckoutSign } = useBankIdContext()

  const [fillCart, fillCartResult] = useManyPetsFillCartMutation()

  const handleSubmitSign: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault()

      if (!shopSession.customer || !shopSession.customer.ssn)
        throw new Error('Must have customer data and ssn in it')

      const shopSessionId = shopSession.id

      if (shopSession.cart.entries.length === 0) {
        console.debug('Filling cart')
        await fillCart({ variables: { shopSessionId, offerIds } })
      } else {
        if (offerIds.length === shopSession.cart.entries.length) {
          const cartOfferIds = new Set(shopSession.cart.entries.map((entry) => entry.id))
          if (offerIds.every((id) => cartOfferIds.has(id))) {
            console.debug('Cart already filled with expected offers')
          } else {
            throw new Error(
              `Cart has unexpected items in it. cartOfferIds=${Array.from(
                cartOfferIds.values(),
              )}, migration offerIds=${offerIds}`,
            )
          }
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
    },
    [shopSession, startCheckoutSign, fillCart, offerIds],
  )

  const signLoading = [BankIdState.Starting, BankIdState.Pending, BankIdState.Success].includes(
    currentOperation?.state as BankIdState,
  )

  return { handleSubmitSign, loading: fillCartResult.loading || signLoading }
}
