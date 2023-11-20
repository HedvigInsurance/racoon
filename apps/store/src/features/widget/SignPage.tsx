import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { type SbBlokData } from '@storyblok/js'
import { StoryblokComponent } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState, type PropsWithChildren } from 'react'
import { Heading, Text, Button, Space, BankIdIcon, CheckIcon, theme, mq } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { FormElement } from '@/components/CheckoutPage/CheckoutPage.constants'
import { useHandleSubmitCheckout } from '@/components/CheckoutPage/useHandleSubmitCheckout'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { QuickAddOfferContainer } from '@/components/QuickAdd/QuickAddOfferContainer'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import {
  type CurrentMemberQuery,
  type CurrentMemberQueryVariables,
  CurrentMemberDocument,
  ShopSessionAuthenticationStatus,
} from '@/services/apollo/generated'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'

type Props = {
  shopSession: ShopSession
  priceIntentId: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  ssn: string
  shouldCollectEmail: boolean
  shouldCollectName: boolean
  suggestedEmail?: string
  flow: string
  content?: Array<SbBlokData>
}

export const SignPage = (props: Props) => {
  const { t } = useTranslation(['widget', 'checkout', 'cart'])
  const { routingLocale } = useCurrentLocale()
  const router = useRouter()

  const { offerRecommendation } = useProductRecommendations(props.shopSession.id)

  const apolloClient = useApolloClient()
  const [showSignError, setShowSignError] = useState(false)
  const tracking = useTracking()
  const [handleSubmitSign, { loading, userError }] = useHandleSubmitCheckout({
    shopSessionId: props.shopSession.id,
    ssn: props.ssn,
    customerAuthenticationStatus: props.customerAuthenticationStatus,
    async onSuccess() {
      const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
        query: CurrentMemberDocument,
      })
      const memberId = data.currentMember.id

      tracking.reportPurchase(
        props.shopSession.cart,
        memberId,
        props.customerAuthenticationStatus === ShopSessionAuthenticationStatus.None,
      )

      const nextUrl = PageLink.widgetPayment({
        flow: props.flow,
        shopSessionId: props.shopSession.id,
        locale: routingLocale,
      })
      await router.push(nextUrl)
    },
    onError() {
      setShowSignError(true)
    },
  })

  const getEditLink = (offerId: string) => {
    const url = PageLink.widgetCalculatePrice({
      flow: props.flow,
      shopSessionId: props.shopSession.id,
      priceIntentId: props.priceIntentId,
      locale: routingLocale,
    })

    url.searchParams.set('replace', offerId)

    return url
  }

  const userErrorMessage = userError?.message

  return (
    <>
      <Wrapper y={3}>
        <Header step="SIGN" />

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
                  {props.shopSession.cart.entries.map((item) => (
                    <ProductItemContainer key={item.id} offer={item}>
                      <ButtonNextLink
                        variant="secondary-alt"
                        size="medium"
                        href={getEditLink(item.id)}
                      >
                        {t('cart:CART_ENTRY_EDIT_BUTTON')}
                      </ButtonNextLink>
                    </ProductItemContainer>
                  ))}
                </ShopBreakdown>

                <DiscountFieldContainer shopSession={props.shopSession} />

                <Divider />

                <TotalAmountContainer cart={props.shopSession.cart} />

                {offerRecommendation && (
                  <QuickAddOfferContainer
                    shopSessionId={props.shopSession.id}
                    {...offerRecommendation}
                  />
                )}

                <form onSubmit={handleSubmitSign}>
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
                        defaultValue={props.suggestedEmail}
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

                        {userErrorMessage ? (
                          <Text as="p" size="xs" color="textSecondary" align="center">
                            {userErrorMessage}
                          </Text>
                        ) : (
                          <TextWithLink
                            as="p"
                            color="textSecondary"
                            size="xs"
                            align="center"
                            balance={true}
                            href={PageLink.privacyPolicy({ locale: routingLocale })}
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
