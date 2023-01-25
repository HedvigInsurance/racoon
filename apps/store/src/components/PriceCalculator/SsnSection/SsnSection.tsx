// States
// 1. IDLE => empty input, no customer information
// [2. KNOKWN => not needed, section collapsed]
// 3. LOADING => updating customer information
// 4. ERROR => error updating customer information
// 5. VALID => customer information updated
// 6. AUTH_REQUIRED => Sign in required
// 7. AUTH_LOADING => Sign in loading
// 8. AUTH_ERROR => Sign in error
// [9. AUTH_SUCCESS => Sign in success, not needed, section collapsed]

import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { PURCHASE_FORM_MAX_WIDTH } from '@/components/ProductPage/PurchaseForm/PurchaseForm.constants'
import { useShopSessionCustomerUpdateMutation } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useSignIn } from './useSignIn'

const FormElementName = 'ssn'

type Props = {
  shopSession: ShopSession
  onCompleted: () => void
}

export const SsnSection = ({ shopSession, onCompleted }: Props) => {
  const { t } = useTranslation('purchase-form')
  // TODO: Show error message if customer update fails
  const [updateCustomer, { loading }] = useShopSessionCustomerUpdateMutation({
    // priceIntent.suggestedData may be updated based on customer.ssn
    refetchQueries: 'active',
    awaitRefetchQueries: true,
    onCompleted() {
      // TODO: Check if user need to authenticate
      // TODO: THrow error if user need to authenticate but customer doesn't have ssn
      onCompleted()
    },
    onError(error) {
      datadogLogs.logger.error("Couldn't update customer ssn", { error })
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const ssn = event.currentTarget[FormElementName].value
    if (typeof ssn !== 'string') throw new Error('No SSN found in SSN section form')
    updateCustomer({ variables: { input: { shopSessionId: shopSession.id, ssn } } })
  }

  // TODO: Show error message if sign in fails
  const [signIn, loadingSignIn] = useSignIn({
    shopSessionId: shopSession.id,
    onSuccess() {
      onCompleted()
    },
  })

  const handleSubmitSignIn: FormEventHandler = (event) => {
    event.preventDefault()
    if (!shopSession.customer?.ssn) throw new Error('No SSN in customer when signing in')
    signIn(shopSession.customer.ssn)
  }

  return (
    // TODO: Check customer auth status shopSession.customer.status === 'AUTH_REQUIRED'
    <Dialog.Root open={true}>
      <form onSubmit={handleSubmit}>
        <Space y={0.25}>
          <PersonalNumberField label={t('FIELD_SSN_SE_LABEL')} name={FormElementName} required />
          <Button type="submit" disabled={loading} loading={loading}>
            {t('SUBMIT_LABEL_PROCEED')}
          </Button>
        </Space>
      </form>

      {shopSession.customer?.ssn && (
        <Dialog.Portal>
          <Overlay />
          <DialogContent>
            <DialogWindow>
              <Space y={1}>
                <Space y={0.5}>
                  <Text size="lg">Är du redan försäkrad via Hedvig?</Text>
                  <Text color="textSecondary">
                    Reference site about lorem ipsum, giving information about its origins.
                  </Text>
                </Space>
                <Space y={0.25}>
                  <form onSubmit={handleSubmitSignIn}>
                    <Button type="submit" disabled={loadingSignIn} loading={loadingSignIn}>
                      Ja, logga in med BankID
                    </Button>
                  </form>
                  <Button variant="ghost" onClick={onCompleted}>
                    Nej, hoppa över
                  </Button>
                </Space>
              </Space>
            </DialogWindow>
          </DialogContent>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  )
}

const Overlay = styled(Dialog.Overlay)({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
})

const DialogContent = styled(Dialog.Content)({
  position: 'fixed',
  inset: 0,

  paddingInline: theme.space.xs,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const DialogWindow = styled.div({
  backgroundColor: theme.colors.light,
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
  paddingBottom: theme.space.xs,
  maxWidth: `calc(${PURCHASE_FORM_MAX_WIDTH} + ${theme.space.md} * 2)`,
})
