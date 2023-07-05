import { isApolloError, useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FormEventHandler, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { Space, Button, Heading, HedvigLogo, BankIdIcon, mq, theme } from 'ui'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import {
  fetchCheckoutSteps,
  getCheckoutStepLink,
} from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import * as ComparisonTable from '@/components/ComparisonTable/ComparisonTable'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { TextWithLink } from '@/components/TextWithLink'
import {
  Money,
  ProductOfferFragment,
  useManyPetsFillCartMutation,
  useShopSessionQuery,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { TrackingContextKey } from '@/services/Tracking/Tracking'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
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
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('checkout')

  const tracking = useTracking()
  const migrationSessionQueryResult = useShopSessionQuery({
    variables: { shopSessionId: migrationSessionId },
    onCompleted() {
      // Not currently used, but may be nice to have if we send some new events from migration session
      tracking.setContext(TrackingContextKey.MigrationSessionId, migrationSessionId)
    },
  })
  const { shopSession: migrationShopSession } = migrationSessionQueryResult.data ?? {}

  const offerIds = offers.map((offer) => offer.id)
  const cartEntries = useMemo(() => offers.map(getCartEntry), [offers])

  const { handleSubmitSign, loading } = useSignMigration(migrationShopSession, offerIds)

  const signButtonRef = useRef<HTMLButtonElement | null>(null)

  const showOfferSection =
    migrationShopSession !== undefined && (cartEntries.length > 0 || comparisonTableData.length > 0)

  const signButtonContent = (
    <SignButtonContent>
      <BankIdIcon color="white" />
      {t('SIGN_BUTTON', { count: cartEntries.length })}
    </SignButtonContent>
  )

  return (
    <>
      {announcement}
      <main>
        {preOfferContent}
        {showOfferSection && (
          <OfferSection y={10}>
            <form id={SIGN_FORM_ID} onSubmit={handleSubmitSign}>
              <Space y={1}>
                <CartEntryList>
                  {cartEntries.map((item) => (
                    <CartEntryItem
                      key={item.offerId}
                      shopSessionId={migrationSessionId}
                      defaultOpen={false}
                      readOnly={true}
                      {...item}
                    />
                  ))}
                </CartEntryList>

                <CostSummary total={totalCost} campaigns={[]} />
                {latestAdoptionDate && <LatestAdoptionNote date={latestAdoptionDate} />}

                <SignButton ref={signButtonRef} type="submit" loading={loading}>
                  {signButtonContent}
                </SignButton>

                <TextWithLink
                  as="p"
                  size={{ _: 'xs', md: 'sm' }}
                  align="center"
                  color="textSecondary"
                  href={PageLink.privacyPolicy({ locale: routingLocale })}
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
                        <ComparisonTable.TitleDataCell>{attribute}</ComparisonTable.TitleDataCell>
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
    </>
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
