import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { theme } from 'ui'
import { ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export type BreadcrumbsProps = { activeStep: 'checkout' | 'payment' | 'switching-assistant' }

export const Breadcrumbs = ({ activeStep }: BreadcrumbsProps) => {
  const { t } = useTranslation('checkout')
  const { shopSession } = useShopSession()
  const showSwitchingAssistant = shopSession?.cart.entries.some(
    (item) => item.cancellation.option === ExternalInsuranceCancellationOption.Banksignering,
  )

  return (
    <Root>
      <Step active={activeStep === 'checkout'}>{t('BREADCRUMB_CHECKOUT')}</Step>
      <Step active={activeStep === 'payment'}>{t('BREADCRUMB_PAYMENT')}</Step>
      {showSwitchingAssistant ? (
        <Step active={activeStep === 'switching-assistant'}>
          {t('BREADCRUMB_SWITCHING_ASSISTANT')}
        </Step>
      ) : (
        <Step>{t('BREADCRUMB_CONFIRMATION')}</Step>
      )}
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

  borderRadius: theme.radius.xs,
  color: theme.colors.textTertiary,
  ...(active && {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textPrimary,
    paddingInline: theme.space.sm,
  }),
}))
