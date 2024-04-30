import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { type SbBlokData } from '@storyblok/js'
import { StoryblokComponent } from '@storyblok/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { type FormEvent, type MouseEvent, type PropsWithChildren, useState } from 'react'
import { BankIdIcon, Button, CheckIcon, Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { FormElement } from '@/components/CheckoutPage/CheckoutPage.constants'
import { useHandleSubmitCheckout } from '@/components/CheckoutPage/useHandleSubmitCheckout'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { QuickAddOfferContainer } from '@/components/QuickAdd/QuickAddOfferContainer'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import { SIGN_FORM_ID } from '@/constants/sign.constants'
import {
  MemberPaymentConnectionStatus,
  useCartEntryRemoveMutation,
  useCurrentMemberLazyQuery,
  type ProductOfferFragment,
  type PriceIntentFragment,
} from '@/services/graphql/generated'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'
import { ProductItemContainer } from './ProductItemContainer'
import { publishWidgetEvent } from './publishWidgetEvent'

type Props = {
  shopSession: ShopSession
  priceIntent: PriceIntentFragment
  ssn: string
  shouldCollectEmail: boolean
  shouldCollectName: boolean
  flow: string
  productName: string
  suggestedEmail?: string
  showBackButton?: boolean
  content?: Array<SbBlokData>
}

export const SignPage = (props: Props) => {
  const { t } = useTranslation(['widget', 'checkout', 'cart'])
  const locale = useRoutingLocale()

  const { offerRecommendation } = useProductRecommendations(props.shopSession.id)

  const [fetchCurrentMember] = useCurrentMemberLazyQuery()
  const [showSignError, setShowSignError] = useState(false)
  const tracking = useTracking()
  const router = useRouter()
  const [handleSubmitSign, { loading, userError }] = useHandleSubmitCheckout({
    shopSessionId: props.shopSession.id,
    ssn: props.ssn,
    async onSuccess() {
      datadogLogs.logger.info('Widget Sign | Sign Success', { shopSessionId: props.shopSession.id })
      publishWidgetEvent.signed()

      const { data } = await fetchCurrentMember()
      if (!data) throw new Error('Widget Sign | Missing current member')

      tracking.reportPurchase({
        cart: props.shopSession.cart,
        memberId: data.currentMember.id,
        customer: data.currentMember,
      })

      const paymentStatus = data.currentMember.paymentInformation.status
      datadogLogs.logger.info('Widget Sign | Purchase Complete', { paymentStatus })

      const nextUrl =
        paymentStatus === MemberPaymentConnectionStatus.NeedsSetup
          ? PageLink.widgetPayment({
              locale,
              flow: props.flow,
              shopSessionId: props.shopSession.id,
            })
          : PageLink.widgetConfirmation({
              locale,
              flow: props.flow,
              shopSessionId: props.shopSession.id,
            })

      await router.push(nextUrl)
    },
    onError() {
      datadogLogs.logger.warn('Widget Sign | Sign Error', { shopSessionId: props.shopSession.id })
      setShowSignError(true)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    datadogRum.addAction('Widget Sign', {
      shopSessionId: props.shopSession.id,
      flow: props.flow,
      products: props.shopSession.cart.entries.map((item) => item.product.name),
    })
    handleSubmitSign(event)
  }

  const mainOffer = props.shopSession.cart.entries.find(
    (item) => item.product.name === props.productName,
  )
  const crossSellOffers = props.shopSession.cart.entries.filter((item) => item.id !== mainOffer?.id)

  const [removeCartItem, result] = useCartEntryRemoveMutation({
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })
  const handleRemoveCartItem =
    (offer: ProductOfferFragment) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation() // Prevent `ProductItem` from expanding
      datadogRum.addAction('Widget Remove Cart Item', { offerId: offer.id })
      tracking.reportDeleteFromCart(offer)
      removeCartItem({
        variables: {
          shopSessionId: props.shopSession.id,
          offerId: offer.id,
        },
      })
    }

  return (
    <>
      <Wrapper y={3}>
        <Header step="SIGN" showBackButton={props.showBackButton} />

        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={3.5}>
              <div>
                <Heading as="h1" variant="standard.24" align="center">
                  {t('WIDGET_CHECKOUT_PAGE_HEADING')}
                </Heading>
                <Text as="p" balance={true} color="textSecondary" align="center" size="xl">
                  {t('WIDGET_CHECKOUT_PAGE_SUBHEADING')}
                </Text>
              </div>

              <Space y={1}>
                <ShopBreakdown>
                  {mainOffer && (
                    <ProductItemContainer
                      shopSessionId={props.shopSession.id}
                      offers={props.priceIntent.offers}
                      selectedOffer={mainOffer}
                    >
                      <ButtonNextLink
                        variant="secondary"
                        size="medium"
                        href={PageLink.widgetCalculatePrice({
                          locale,
                          flow: props.flow,
                          shopSessionId: props.shopSession.id,
                          priceIntentId: props.priceIntent.id,
                        })}
                      >
                        {t('cart:CART_ENTRY_EDIT_BUTTON')}
                      </ButtonNextLink>
                    </ProductItemContainer>
                  )}
                  <AnimatePresence initial={false}>
                    {crossSellOffers.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ position: 'relative' }}
                      >
                        <ProductItemContainer
                          shopSessionId={props.shopSession.id}
                          offers={[item]}
                          selectedOffer={item}
                          onDelete={handleRemoveCartItem(item)}
                        />
                        {result.loading && <ProductItemLoadingOverlay />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ShopBreakdown>

                <DiscountFieldContainer shopSession={props.shopSession} />

                <Divider />

                <TotalAmountContainer cart={props.shopSession.cart} />

                {offerRecommendation && (
                  <QuickAddOfferContainer
                    cart={props.shopSession.cart}
                    shopSessionId={props.shopSession.id}
                    {...offerRecommendation}
                  />
                )}

                <form id={SIGN_FORM_ID} onSubmit={handleSubmit}>
                  <Space y={0.25}>
                    <PersonalNumberField
                      label={t('checkout:FIELD_PERSONAL_NUMBER_SE_LABEL')}
                      value={props.ssn}
                      readOnly
                      disabled
                    />

                    {props.shouldCollectName && (
                      <>
                        <TextField
                          type="text"
                          label={t('checkout:FORM_FIRST_NAME_LABEL')}
                          name={FormElement.FirstName}
                          required
                        />
                        <TextField
                          type="text"
                          label={t('checkout:FORM_LAST_NAME_LABEL')}
                          name={FormElement.LastName}
                          required
                        />
                      </>
                    )}

                    {props.shouldCollectEmail && (
                      <TextField
                        type="email"
                        label={t('checkout:FORM_EMAIL_LABEL')}
                        name={FormElement.Email}
                        required
                      />
                    )}

                    <Space y={1}>
                      <SignButton loading={loading} showBankIdIcon={true}>
                        {t('checkout:SIGN_BUTTON', {
                          count: props.shopSession.cart.entries.length,
                        })}
                      </SignButton>

                      <Space y={1.6}>
                        <UspWrapper>
                          <CheckIcon size="1rem" />
                          <Text size="xs">{t('USP_TEXT')}</Text>
                        </UspWrapper>

                        {userError ? (
                          <Text as="p" size="xs" color="textSecondary" align="center">
                            {userError}
                          </Text>
                        ) : (
                          <TextWithLink
                            as="p"
                            color="textSecondary"
                            size="xs"
                            align="center"
                            balance={true}
                            href={PageLink.privacyPolicy({ locale })}
                            target="_blank"
                          >
                            {t('checkout:SIGN_DISCLAIMER')}
                          </TextWithLink>
                        )}
                      </Space>
                    </Space>
                  </Space>
                </form>
              </Space>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        <div>
          {props.content?.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </div>
      </Wrapper>

      <FullscreenDialog.Root open={showSignError} onOpenChange={setShowSignError}>
        <FullscreenDialog.Modal
          center={true}
          Footer={
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="primary">
                {t('checkout:ERROR_GENERAL_DIALOG_ACTION_TRY_AGAIN')}
              </Button>
            </FullscreenDialog.Close>
          }
        >
          <ErrorPrompt size={{ _: 'md', lg: 'lg' }} align="center">
            {t('checkout:ERROR_GENERAL_DIALOG_PROMPT')}
          </ErrorPrompt>
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </>
  )
}

const Wrapper = styled(Space)({
  paddingBottom: theme.space.lg,
  [mq.lg]: { paddingBottom: theme.space.xxl },
})

type SignButtonProps = PropsWithChildren<{ loading: boolean; showBankIdIcon: boolean }>
const SignButton = ({ children, loading, showBankIdIcon }: SignButtonProps) => {
  return (
    <Button type="submit" loading={loading}>
      <StyledSignButtonContent>
        {showBankIdIcon && <BankIdIcon color="white" />}
        {children}
      </StyledSignButtonContent>
    </Button>
  )
}

const ProductItemLoadingOverlay = styled.div({
  backgroundColor: theme.colors.grayTranslucentDark700,
  position: 'absolute',
  inset: 0,
  borderRadius: theme.radius.md,
})

const StyledSignButtonContent = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.sm,
  width: '100%',
})

const ErrorPrompt = styled(Text)({
  maxWidth: '42rem',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const UspWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xs,
})
