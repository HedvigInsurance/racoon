import { useTranslation } from 'next-i18next'
import { CheckIcon } from 'ui'
import * as ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator'

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
    <ProgressIndicator.Root>
      {steps.map((item) => (
        <ProgressIndicator.Step key={item} active={item === activeStep}>
          {activeStepIndex > steps.indexOf(item) && <CheckIcon size="1rem" />}
          {getCheckoutStepLabel(item)}
        </ProgressIndicator.Step>
      ))}
    </ProgressIndicator.Root>
  )
}

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
