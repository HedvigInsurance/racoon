import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { CheckIcon, theme } from 'ui'

export enum CheckoutStep {
  Checkout = 'checkout',
  Payment = 'payment',
  Confirmation = 'confirmation',
  Done = 'done',
}

export type BreadcrumbsProps = { steps: Array<CheckoutStep>; activeStep: CheckoutStep }

export const Breadcrumbs = ({ steps, activeStep }: BreadcrumbsProps) => {
  const getCheckoutStepLabel = useGetCheckoutStepLabel()
  const activeStepIndex = steps.indexOf(activeStep)

  return (
    <Root>
      {steps.map((item) => (
        <Step key={item} active={item === activeStep}>
          {activeStepIndex > steps.indexOf(item) && <CheckIcon size="1rem" />}
          {getCheckoutStepLabel(item)}
        </Step>
      ))}
    </Root>
  )
}

const Root = styled.ul({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: theme.space.xs,
})

const Step = styled.li<{ active: boolean }>(({ active }) => ({
  fontSize: theme.fontSizes.xs,
  height: theme.space.xl,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xs,

  color: theme.colors.textTertiary,
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.xxs,
  border: `1px solid ${theme.colors.opaque1}`,

  ...(active && {
    backgroundColor: theme.colors.green100,
    color: theme.colors.signalGreenText,
    borderColor: theme.colors.green200,
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
      case CheckoutStep.Confirmation:
        return t('BREADCRUMB_CONFIRMATION')
      case CheckoutStep.Done:
        return t('BREADCRUMB_DONE')
    }
  }
}
