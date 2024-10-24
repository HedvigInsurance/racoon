'use client'

import { useApolloClient } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import { Text, Button, BankIdIcon, yStack } from 'ui'
import { useHandleSubmitCheckout } from '@/app/[locale]/checkout/hooks/useHandleSubmitCheckout'
import { useAsyncRouterPush } from '@/appComponents/useAsyncRouterPush'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { TextField } from '@/components/TextField/TextField'
import { SIGN_FORM_ID } from '@/constants/sign.constants'
import {
  CurrentMemberDocument,
  type CurrentMemberQuery,
  type CurrentMemberQueryVariables,
  type CartFragment,
  MemberPaymentConnectionStatus,
} from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { CheckoutStep, FormElement } from '../CheckoutPage.constants'
import { getCheckoutStepLink } from '../CheckoutPage.helpers'

type CheckoutFormProps = {
  shopSessionId: string
  ssn: string
  cart: CartFragment
  shouldCollectName: boolean
  shouldCollectEmail: boolean
}

export function CheckoutForm({
  shopSessionId,
  ssn,
  cart,
  shouldCollectName,
  shouldCollectEmail,
}: CheckoutFormProps) {
  const { reset: resetShopSession } = useShopSession()

  const { t } = useTranslation(['checkout', 'cart'])
  const tracking = useTracking()
  const locale = useRoutingLocale()

  const push = useAsyncRouterPush()
  const apolloClient = useApolloClient()

  const [handleSubmitSign, { loading, userError }] = useHandleSubmitCheckout({
    shopSessionId,
    ssn,
    async onSuccess() {
      const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
        query: CurrentMemberDocument,
      })
      const memberId = data.currentMember.id

      tracking.reportPurchase({
        cart,
        memberId,
        customer: data.currentMember,
      })
      resetShopSession()

      const nextCheckoutStep = getNextCheckoutStep(data.currentMember.paymentInformation.status)
      await push(getCheckoutStepLink({ locale, step: nextCheckoutStep, shopSessionId }))
    },
  })

  return (
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
          <TextField type="email" label={t('FORM_EMAIL_LABEL')} name={FormElement.Email} required />
        )}

        <div className={yStack({ gap: 'xs' })}>
          <Button Icon={<BankIdIcon color="white" />} loading={loading}>
            {t('SIGN_BUTTON', { count: cart.entries.length })}
          </Button>

          {userError ? (
            <Text as="p" size="xs" color="textSecondary" align="center">
              {userError}
            </Text>
          ) : null}
        </div>
      </div>
    </form>
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
