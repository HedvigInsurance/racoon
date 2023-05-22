import { isApolloError, useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { FormEventHandler, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { Button, Space, Heading, HedvigLogo, BankIdIcon, mq, theme } from 'ui'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import {
  fetchCheckoutSteps,
  getCheckoutStepLink,
} from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import * as ComparisonTable from '@/components/ProductPage/PurchaseForm/ComparisonTable/ComparisonTable'
import { Money, ProductOffer, useManyPetsFillCartMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { type ComparisonTableData } from '@/services/manypets/manypets.types'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { ManypetsLogo } from './ManypetsLogo'

const manypetsLogger = datadogLogs.createLogger('manypets')

export type ManyPetsMigrationPageProps = {
  preOfferContent?: ReactNode
  postOfferContent: ReactNode
  offers: Array<ProductOffer>
  totalCost: Money
  comparisonTableData: ComparisonTableData
}

export const ManyPetsMigrationPage = ({
  preOfferContent,
  postOfferContent,
  offers,
  totalCost,
  comparisonTableData,
}: ManyPetsMigrationPageProps) => {
  const { t } = useTranslation('checkout')
  const { shopSession } = useShopSession()

  const offerIds = offers.map((offer) => offer.id)
  const cartEntries = useMemo(() => offers.map(getCartEntry), [offers])

  const { handleSubmitSign, loading } = useSignMigration(shopSession, offerIds)

  const shouldRenderDynamicSection =
    shopSession !== undefined && (cartEntries.length > 0 || comparisonTableData.length > 0)

  return (
    <main>
      {preOfferContent}
      {shouldRenderDynamicSection && (
        <OfferSection y={10}>
          <form onSubmit={handleSubmitSign}>
            <Space y={1}>
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

              <CostSummary total={totalCost} campaigns={[]} />

              <Button type="submit" loading={loading}>
                <SignButtonContent>
                  <BankIdIcon color="white" />
                  {t('SIGN_BUTTON', { count: cartEntries.length })}
                </SignButtonContent>
              </Button>
            </Space>
          </form>

          <Space y={{ base: 2, md: 3 }}>
            {/* TODO: Lokalise this? */}
            <Heading as="h2" variant="standard.32" align="center" balance={true}>
              Byt till Hedvig och behåll ditt skydd.
            </Heading>

            <ComparisonTable.Root>
              <ComparisonTable.Head>
                <ComparisonTable.Row>
                  <ComparisonTable.Header />
                  <ComparisonTable.Header>
                    <Centered>
                      <ManypetsLogo />
                    </Centered>
                  </ComparisonTable.Header>
                  <ComparisonTable.Header active>
                    <Centered>
                      <HedvigLogo />
                    </Centered>
                  </ComparisonTable.Header>
                </ComparisonTable.Row>
              </ComparisonTable.Head>
              <ComparisonTable.Body>
                {comparisonTableData.map(([attribute, value]) => {
                  const parsedValue = parseTableValue(value)

                  return (
                    <ComparisonTable.Row key={attribute}>
                      <ComparisonTable.TitleDataCell>{attribute}</ComparisonTable.TitleDataCell>
                      <ComparisonTable.DataCell>{parsedValue}</ComparisonTable.DataCell>
                      <ComparisonTable.DataCell active>{parsedValue}</ComparisonTable.DataCell>
                    </ComparisonTable.Row>
                  )
                })}
              </ComparisonTable.Body>
            </ComparisonTable.Root>
          </Space>
        </OfferSection>
      )}
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

const parseTableValue = (value: string | boolean): ReactNode => {
  if (typeof value === 'boolean') {
    return value === true ? <ComparisonTable.CheckIcon /> : <ComparisonTable.MissingIcon />
  }

  return value
}

const OfferSection = styled(Space)({
  paddingInline: theme.space.md,
  maxWidth: '28.5rem',
  marginInline: 'auto',

  [mq.lg]: {
    paddingInline: 0,
  },
})

const Centered = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const SignButtonContent = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.sm,
  width: '100%',
})
