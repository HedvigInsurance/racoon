'use client'

import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Text, Button, BankIdIcon, yStack } from 'ui'
import { useHandleSubmitCheckout } from '@/components/CheckoutPage/useHandleSubmitCheckout'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import { SIGN_FORM_ID } from '@/constants/sign.constants'
import {
  CurrentMemberDocument,
  type CurrentMemberQuery,
  type CurrentMemberQueryVariables,
  MemberPaymentConnectionStatus,
} from '@/services/graphql/generated'
import { useShopSessionSuspense } from '@/services/shopSession/app-router/useShopSessionSuspense'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { errorPrompt } from './CheckoutForm.css'
import { CheckoutStep, FormElement } from './CheckoutPage.constants'
import { getCheckoutStepLink } from './CheckoutPage.helpers'

type CheckoutFormProps = {
  shopSessionId: string
}

export function CheckoutForm({ shopSessionId }: CheckoutFormProps) {
  const shopSession = useShopSessionSuspense({ shopSessionId })
  // We check for the presence of customer and ssn values at route level
  const customer = shopSession.customer!
  const ssn = customer.ssn!
  const { reset: resetShopSession } = useShopSession()

  const { t } = useTranslation('checkout')
  const tracking = useTracking()
  const locale = useRoutingLocale()

  const router = useRouter()
  const apolloClient = useApolloClient()

  const [shouldShowSignError, setShouldShowSignError] = useState(false)

  const [handleSubmitSign, { loading, userError }] = useHandleSubmitCheckout({
    shopSessionId: shopSession.id,
    ssn,
    async onSuccess() {
      const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
        query: CurrentMemberDocument,
      })
      const memberId = data.currentMember.id

      tracking.reportPurchase({
        cart: shopSession.cart,
        memberId,
        customer: data.currentMember,
      })
      resetShopSession()

      const nextCheckoutStep = getNextCheckoutStep(data.currentMember.paymentInformation.status)
      // TODO: router from next/navigation has a different API so we can't wait for the router to be updated
      // before we navigate to the next step. We probably gonna need to change how BankIdDialog works so
      // we can have smooth transitions betweens sucess state and connect payment page.
      router.push(
        getCheckoutStepLink({ locale, step: nextCheckoutStep, shopSessionId: shopSession.id }),
      )
    },
    onError() {
      setShouldShowSignError(true)
    },
  })

  const shouldCollectName = getShouldCollectName(customer)
  const shouldCollectEmail = getShouldCollectEmail(customer)

  return (
    <>
      <form id={SIGN_FORM_ID} onSubmit={handleSubmitSign}>
        <div className={yStack({ gap: 'xxs' })}>
          <PersonalNumberField
            label={t('FIELD_PERSONAL_NUMBER_SE_LABEL')}
            value={ssn}
            readOnly
            disabled
          />
          {shouldCollectName && (
            <>
              <TextField
                type="text"
                label={t('FORM_FIRST_NAME_LABEL')}
                name={FormElement.FirstName}
                required
              />
              <TextField
                type="text"
                label={t('FORM_LAST_NAME_LABEL')}
                name={FormElement.LastName}
                required
              />
            </>
          )}
          {shouldCollectEmail && (
            <TextField
              type="email"
              label={t('FORM_EMAIL_LABEL')}
              name={FormElement.Email}
              required
            />
          )}

          <div className={yStack({ gap: 'xs' })}>
            <Button Icon={<BankIdIcon color="white" />} loading={loading}>
              {t('SIGN_BUTTON', { count: shopSession.cart.entries.length })}
            </Button>
            {userError ? (
              <Text as="p" size="xs" color="textSecondary" align="center">
                {userError}
              </Text>
            ) : (
              <TextWithLink
                as="p"
                size="xs"
                align="center"
                balance={true}
                href={PageLink.privacyPolicy({ locale })}
                target="_blank"
              >
                {t('SIGN_DISCLAIMER')}
              </TextWithLink>
            )}
          </div>
        </div>
      </form>

      <FullscreenDialog.Root open={shouldShowSignError} onOpenChange={setShouldShowSignError}>
        <FullscreenDialog.Modal
          center={true}
          Footer={
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="primary">
                {t('ERROR_GENERAL_DIALOG_ACTION_TRY_AGAIN')}
              </Button>
            </FullscreenDialog.Close>
          }
        >
          <Text className={errorPrompt} size={{ _: 'md', lg: 'lg' }} align="center">
            {t('ERROR_GENERAL_DIALOG_PROMPT')}
          </Text>
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </>
  )
}

function getNextCheckoutStep(connectPaymentStatus: MemberPaymentConnectionStatus): CheckoutStep {
  const checkoutSteps: Array<CheckoutStep> = [CheckoutStep.Checkout]
  const showPayment = connectPaymentStatus === MemberPaymentConnectionStatus.NeedsSetup
  if (showPayment) checkoutSteps.push(CheckoutStep.Payment)
  if (checkoutSteps.length < 3) checkoutSteps.push(CheckoutStep.Confirmation)
  if (checkoutSteps.length < 3) checkoutSteps.push(CheckoutStep.Done)
  // CheckoutStep.Checkout (current step) is always the first step so the next step is always at index 1
  const nextCheckoutStep = checkoutSteps[1]

  return nextCheckoutStep
}
