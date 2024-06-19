import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { useState } from 'react'
import { Button, mq, Space, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.constants'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useRedeemCampaign } from '@/utils/useCampaign'
import { usePrintTextEffect } from './usePrintTextEffect'

export type Props = { code: string }

export const ForeverPage = ({ code: initialCode }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [code, setCode] = useState('')
  usePrintTextEffect({ value: initialCode, onValueChange: setCode })

  const { shopSession } = useShopSession()
  const locale = useRoutingLocale()
  const redirectUrl = PageLink.store({ locale })
  const [addCampaign, { errorMessage, loading, called }] = useRedeemCampaign({
    shopSessionId: shopSession?.id ?? '',
    onCompleted() {
      router.push(redirectUrl)
    },
  })
  const showLoading = loading || (called && !errorMessage)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    router.prefetch(redirectUrl.pathname)
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
              <Button type="submit" loading={showLoading} fullWidth={true}>
                {t('FOREVER_PAGE_BTN_LABEL')}
              </Button>
            </Space>
          </form>
        </GridLayout.Content>
      </GridLayout.Root>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <TextWithLink
            as="p"
            size="xs"
            align="center"
            balance={true}
            href={PageLink.home({ locale }).pathname}
          >
            {t('FOREVER_PAGE_FOOTER_TEXT')}
          </TextWithLink>
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
