import { useTranslation } from 'next-i18next'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { Text, theme } from 'ui'
import { IframePlaceholder } from './IdleState'
import { Layout } from './Layout'

export const SuccessState = () => {
  const { t } = useTranslation()

  return (
    <Layout>
      <IframePlaceholder>
        <CheckIcon color={theme.colors.signalGreenElement} />
        <Text size={{ _: 'md', lg: 'lg' }}>{t('PAYMENT_CONNECT_SUCCESS')}</Text>
      </IframePlaceholder>
    </Layout>
  )
}
