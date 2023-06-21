import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { CheckIcon, Text, theme } from 'ui'

export const SuccessState = () => {
  const { t } = useTranslation('checkout')

  return (
    <Centered>
      <CheckIcon color={theme.colors.signalGreenElement} />
      <Text>{t('PAYMENT_TRUSTLY_SUCCESS_MESSAGE')}</Text>
    </Centered>
  )
}

const Centered = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.lg,
  height: '100vh',
})
