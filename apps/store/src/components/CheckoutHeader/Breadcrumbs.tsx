import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { theme } from 'ui'

export enum CheckoutStep {
  Checkout = 'checkout',
  Payment = 'payment',
  SwitchingAssistant = 'switchingAssistant',
  Confirmation = 'confirmation',
  Done = 'done',
}

export type BreadcrumbsProps = { steps: Array<CheckoutStep>; activeStep: CheckoutStep }

export const Breadcrumbs = ({ steps, activeStep }: BreadcrumbsProps) => {
  const getCheckoutStepLabel = useGetCheckoutStepLabel()

  return (
    <Root>
      {steps.map((item) => (
        <Step key={item} active={item === activeStep}>
          {getCheckoutStepLabel(item)}
        </Step>
      ))}
    </Root>
  )
}

const Root = styled.ul({
  display: 'flex',
  justifyContent: 'space-between',
})

const Step = styled.li<{ active?: boolean }>(({ active }) => ({
  fontSize: theme.fontSizes.sm,
  height: theme.space.xl,
  display: 'flex',
  alignItems: 'center',

  color: theme.colors.textTertiary,
  ...(active && {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textPrimary,
    paddingInline: theme.space.sm,
    borderRadius: theme.radius.xs,
  }),
}))

const useGetCheckoutStepLabel = () => {
  const { t } = useTranslation('checkout')

  return (step: CheckoutStep) => {
    switch (step) {
      case CheckoutStep.Checkout:
        return t('BREADCRUMB_CHECKOUT')
      case CheckoutStep.Payment:
        return t('BREADCRUMB_PAYMENT')
      case CheckoutStep.SwitchingAssistant:
        return t('BREADCRUMB_SWITCHING_ASSISTANT')
      case CheckoutStep.Confirmation:
        return t('BREADCRUMB_CONFIRMATION')
      case CheckoutStep.Done:
        return t('BREADCRUMB_DONE')
    }
  }
}
