import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { theme } from 'ui'
import { ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const Breadcrumbs = () => {
  const { t } = useTranslation('checkout')
  const { shopSession } = useShopSession()
  const switchingEntry = shopSession?.cart.entries.find(
    (item) => item.cancellation.option === ExternalInsuranceCancellationOption.Banksignering,
  )
  const showSwitchingAssistant = !!switchingEntry

  return (
    <Root>
      <Step active>{t('BREADCRUMB_CHECKOUT')}</Step>
      <Step>{t('BREADCRUMB_PAYMENT')}</Step>
      {showSwitchingAssistant ? (
        <Step>{t('BREADCRUMB_SWITCHING_ASSISTANT')}</Step>
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

  color: theme.colors.textTertiary,
  ...(active && {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textPrimary,
    paddingInline: theme.space.sm,
    borderRadius: theme.radius.xs,
  }),
}))
