import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { FormEventHandler, useState } from 'react'
import { Button, Space, mq, theme } from 'ui'
import { useRedeemCampaign } from '@/components/CartInventory/useCampaign'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { usePrintTextEffect } from './usePrintTextEffect'

export type Props = { code: string }

export const ForeverPage = ({ code: initialCode }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [code, setCode] = useState('')
  usePrintTextEffect({ value: initialCode, onValueChange: setCode })

  const { shopSession } = useShopSession()
  const { routingLocale } = useCurrentLocale()
  const { addBanner } = useGlobalBanner()
  const redirectUrl = PageLink.store({ locale: routingLocale })
  const [addCampaign, { errorMessage, loading, called }] = useRedeemCampaign({
    shopSessionId: shopSession?.id ?? '',
    async onCompleted() {
      await router.push(redirectUrl)
      addBanner(t('GLOBAL_BANNER_CAMPAIGN'))
    },
  })
  const showLoading = loading || (called && !errorMessage)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    router.prefetch(redirectUrl)
    addCampaign(code)
  }

  return (
    <Layout>
      <GridLayout.Root as="main">
        <GridLayout.Content width="1/3" align="center">
          <form onSubmit={handleSubmit}>
            <Space y={errorMessage ? 1 : 0.25}>
              <UppercaseTextField
                name="code"
                label={t('FOREVER_PAGE_INPUT_TEXT')}
                value={code}
                onValueChange={(value) => setCode(value)}
                required={true}
                message={errorMessage}
                warning={!!errorMessage}
              />
              <Button type="submit" loading={showLoading}>
                {t('FOREVER_PAGE_BTN_LABEL')}
              </Button>
            </Space>
          </form>
        </GridLayout.Content>
      </GridLayout.Root>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <TextWithLink href={PageLink.home()}>{t('FOREVER_PAGE_FOOTER_TEXT')}</TextWithLink>
        </GridLayout.Content>
      </GridLayout.Root>
    </Layout>
  )
}

const Layout = styled.div({
  '--header-height': HEADER_HEIGHT_MOBILE,
  display: 'grid',
  gridTemplateRows: '1fr auto',
  alignItems: 'center',
  height: 'calc(100vh - var(--header-height))',
  paddingBlock: theme.space.md,

  [mq.lg]: {
    '--header-height': HEADER_HEIGHT_DESKTOP,
    paddingBlock: theme.space.xl,
  },
})

const UppercaseTextField = styled(TextField)({
  textTransform: 'uppercase',
})
