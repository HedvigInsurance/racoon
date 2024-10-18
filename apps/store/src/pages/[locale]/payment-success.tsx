import styled from '@emotion/styled'
import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { Text, theme } from 'ui'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'
import { staticPathsPerSwedenLocale } from '@/utils/staticPaths'

export const PaymentSuccessPage = () => {
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

export default PaymentSuccessPage

export const getStaticProps: GetStaticProps = async (context) => {
  patchNextI18nContext(context)
  if (!isRoutingLocale(context.locale)) return { notFound: true }

  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
    },
  }
}

export const getStaticPaths = staticPathsPerSwedenLocale
