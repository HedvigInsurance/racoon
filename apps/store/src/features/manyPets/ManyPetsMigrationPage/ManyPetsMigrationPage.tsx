import { isApolloError, useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler, ReactNode } from 'react'
import { useCallback, useRef } from 'react'
import { BankIdIcon, Button, Heading, HedvigLogo, mq, Space, theme } from 'ui'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import {
  fetchCheckoutSteps,
  getCheckoutStepLink,
} from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import * as ComparisonTable from '@/components/ComparisonTable/ComparisonTable'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { TextWithLink } from '@/components/TextWithLink'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import type { Money, ProductOfferFragment } from '@/services/graphql/generated'
import { useManyPetsFillCartMutation, useShopSessionQuery } from '@/services/graphql/generated'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { type ComparisonTableData } from '../manyPets.types'
import { LatestAdoptionNote } from './LatestAdoptionNote'
import { ManypetsLogo } from './ManypetsLogo'

const manypetsLogger = datadogLogs.createLogger('manypets')

const SIGN_FORM_ID = 'sign-form'

export type ManyPetsMigrationPageProps = {
  // NOTE: Not using [SHOP_SESSION_PROP_NAME] to avoid clash with site-wide session
  migrationSessionId: string
  announcement?: ReactNode
  preOfferContent?: ReactNode
  postOfferContent: ReactNode
  offers: Array<ProductOfferFragment>
  totalCost: Money
  latestAdoptionDate?: string
  comparisonTableData: ComparisonTableData
}

export const ManyPetsMigrationPage = ({
  migrationSessionId,
  announcement,
  preOfferContent,
  postOfferContent,
  offers,
  totalCost,
  latestAdoptionDate,
  comparisonTableData,
}: ManyPetsMigrationPageProps) => {
  const locale = useRoutingLocale()
  const { t } = useTranslation('checkout')

  const migrationSessionQueryResult = useShopSessionQuery({
    variables: { shopSessionId: migrationSessionId },
  })
  const { shopSession: migrationShopSession } = migrationSessionQueryResult.data ?? {}

  const offerIds = offers.map((offer) => offer.id)

  const { handleSubmitSign, loading } = useSignMigration(migrationShopSession, offerIds)

  const signButtonRef = useRef<HTMLButtonElement | null>(null)

  const showOfferSection =
    migrationShopSession !== undefined && (offers.length > 0 || comparisonTableData.length > 0)

  const signButtonContent = (
    <SignButtonContent>
      <BankIdIcon color="white" />
      {t('SIGN_BUTTON', { count: offers.length })}
    </SignButtonContent>
  )

  return (
    <TrackingProvider shopSession={migrationSessionQueryResult.data?.shopSession}>
      {announcement}
      <main>
        {preOfferContent}
        {showOfferSection && (
          <OfferSection y={10}>
            <form id={SIGN_FORM_ID} onSubmit={handleSubmitSign}>
              <Space y={1}>
                <ShopBreakdown>
                  {offers.map((item) => (
                    <ProductItemContainer key={item.id} offer={item} />
                  ))}
                </ShopBreakdown>

                {/* There are no discounts for MP shop sessions */}
                <TotalAmount currencyCode={totalCost.currencyCode} amount={totalCost.amount} />
                {latestAdoptionDate && <LatestAdoptionNote date={latestAdoptionDate} />}

                <SignButton ref={signButtonRef} type="submit" loading={loading}>
                  {signButtonContent}
                </SignButton>

                <TextWithLink
                  as="p"
                  size={{ _: 'xs', md: 'sm' }}
                  align="center"
                  color="textSecondary"
                  href={PageLink.privacyPolicy({ locale })}
                  target="_blank"
                >
                  {t('SIGN_DISCLAIMER')}
                </TextWithLink>
              </Space>
            </form>

            <Space y={{ base: 2, md: 3 }}>
              <Heading as="h2" variant="standard.32" align="center" balance={true}>
                {t('MANYPETS_COMPARISON_HEADER')}
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
                    <ComparisonTable.Header active={true}>
                      <Centered>
                        {/* Both icons are composed differently. For optical sizing, they should diff 2px in width/height */}
                        <HedvigLogo width={76} height={22} />
                      </Centered>
                    </ComparisonTable.Header>
                  </ComparisonTable.Row>
                </ComparisonTable.Head>
                <ComparisonTable.Body>
                  {comparisonTableData.map(([attribute, value]) => {
                    const parsedValue = parseTableValue(value)

                    return (
                      <ComparisonTable.Row key={attribute}>
                        <ComparisonTable.TitleDataCell title={attribute} />
                        <ComparisonTable.DataCell>{parsedValue}</ComparisonTable.DataCell>
                        <ComparisonTable.DataCell active={true}>
                          {parsedValue}
                        </ComparisonTable.DataCell>
                      </ComparisonTable.Row>
                    )
                  })}
                </ComparisonTable.Body>
              </ComparisonTable.Root>
            </Space>
          </OfferSection>
        )}
        {postOfferContent}
        <FloatSignButtonWrapper targetRef={signButtonRef}>
          <SignButton form={SIGN_FORM_ID} loading={loading}>
            {signButtonContent}
          </SignButton>
        </FloatSignButtonWrapper>
      </main>
    </TrackingProvider>
  )
}

const OfferSection = styled(Space)({
  paddingInline: theme.space.md,
  maxWidth: '31.5rem',
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

const FloatSignButtonWrapper = styled(ScrollPast)({
  maxWidth: '31.5rem',
  marginInline: 'auto',
  paddingInline: theme.space.md,
  zIndex: 0,
})

const SignButton = styled(Button)({
  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.gray900,
    },
  },

  ':active': {
    backgroundColor: theme.colors.gray900,
  },
})

const useSignMigration = (
  shopSession: Pick<ShopSession, 'id' | 'customer' | 'cart'> | undefined,
  offerIds: Array<string>,
) => {
  const { currentOperation, startCheckoutSign } = useBankIdContext()
  const { showError } = useAppErrorHandleContext()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const locale = useRoutingLocale()

  const [fillCart, fillCartResult] = useManyPetsFillCartMutation()

  const handleSubmitSign: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault()

      if (!shopSession) return

      if (!shopSession.customer?.ssn) {
        throw new Error('Must have customer data and ssn in it')
      }

      const shopSessionId = shopSession.id
      const { ssn } = shopSession.customer
      manypetsLogger.setContextProperty('shopSessionId', shopSessionId)

      datadogRum.addAction('ManyPets StartingSigning', {
        shopSessionId,
        entriesCount: shopSession.cart.entries.length,
      })

      try {
        if (shopSession.cart.entries.length === 0) {
          manypetsLogger.info('Cart is empty. Filling it with migration offers')
          await fillCart({ variables: { shopSessionId, offerIds } })
        } else {
          const cartOfferIds = new Set(shopSession.cart.entries.map((entry) => entry.id))
          if (
            offerIds.length === shopSession.cart.entries.length &&
            offerIds.every((id) => cartOfferIds.has(id))
          ) {
            manypetsLogger.info('Cart already filled with expected offers')
          } else {
            throw new Error(
              `Cart has unexpected items in it. cartOfferIds=${Array.from(
                cartOfferIds.values(),
              )}, migration offerIds=${offerIds}`,
            )
          }
        }

        manypetsLogger.info('ManyPets StartingCheckoutSign')
        startCheckoutSign({
          shopSessionId,
          ssn,
          async onSuccess() {
            manypetsLogger.info('ManyPets Successfully sign shopsession. Moving on to checkout')
            const checkoutSteps = await fetchCheckoutSteps({ apolloClient, shopSession })
            const checkoutStepIndex = checkoutSteps.findIndex(
              (item) => item === CheckoutStep.Checkout,
            )
            const nextCheckoutStep = checkoutSteps[checkoutStepIndex + 1]

            setupShopSessionServiceClientSide(apolloClient).reset()

            await router.push(
              getCheckoutStepLink({ locale, step: nextCheckoutStep, shopSessionId }),
            )
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
    [shopSession, startCheckoutSign, fillCart, offerIds, apolloClient, router, locale, showError],
  )

  let signLoading = false
  const { state: bankIdState } = currentOperation ?? {}
  if (bankIdState) {
    signLoading = [BankIdState.Starting, BankIdState.Pending, BankIdState.Success].includes(
      bankIdState,
    )
  }

  return { handleSubmitSign, loading: fillCartResult.loading || signLoading }
}

const parseTableValue = (value: string | boolean): ReactNode => {
  if (typeof value === 'boolean') {
    return value === true ? <ComparisonTable.CheckIcon /> : <ComparisonTable.MissingIcon />
  }

  return value
}
