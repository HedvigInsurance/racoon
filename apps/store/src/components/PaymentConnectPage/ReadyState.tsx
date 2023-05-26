import { useTranslation } from 'next-i18next'
import { Space, Text } from 'ui'
import { TrustlyIframe } from '@/services/trustly/TrustlyIframe'
import { Layout } from './Layout'

type Props = {
  trustlyUrl: string
  onSuccess: () => void
  onFail: () => void
}

export const ReadyState = (props: Props) => {
  const { t } = useTranslation('checkout')

  return (
    <Layout>
      <Space y={0.75}>
        <TrustlyIframe url={props.trustlyUrl} onSuccess={props.onSuccess} onFail={props.onFail} />
        <Text size="xs" align="center">
          {t('PAYMENT_TRUSTLY_FOOTNOTE')}
        </Text>
      </Space>
    </Layout>
  )
}
