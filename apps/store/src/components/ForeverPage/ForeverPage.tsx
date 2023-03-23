import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEventHandler, useState } from 'react'
import { Button, HedvigLogo, Space, Text, mq, theme } from 'ui'
import { linkStyles } from '@/blocks/RichTextBlock/RichTextBlock.styles'
import { useRedeemCampaign } from '@/components/CartInventory/useCampaign'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { TextField } from '@/components/TextField/TextField'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { usePrintTextEffect } from './usePrintTextEffect'

export const ForeverPage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const [code, setCode] = useState('')
  const initialCode = (router.query.code as string | undefined) ?? ''
  usePrintTextEffect({ value: initialCode, onValueChange: setCode })

  const footerText = t('FOREVER_PAGE_FOOTER_TEXT')
    .split('[[')
    .map((text) => {
      const [linkText, secondParam] = text.split(']]')

      if (secondParam === undefined) return text

      return (
        <Link key={linkText} href={PageLink.home()}>
          {linkText}
        </Link>
      )
    })

  const { routingLocale } = useCurrentLocale()
  const { shopSession } = useShopSession()
  const [addCampaign, { errorMessage, loading }] = useRedeemCampaign({
    cartId: shopSession?.cart.id ?? '',
    onCompleted: () => {
      router.push(PageLink.store({ locale: routingLocale }))
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    addCampaign(code)
  }

  return (
    <Layout>
      <Header>
        <Link href={PageLink.home()}>
          <HedvigLogo />
        </Link>
      </Header>
      <GridLayout.Root as="main">
        <GridLayout.Content width="1/3" align="center">
          <form onSubmit={handleSubmit}>
            <Space y={0.25}>
              <UppercaseTextField
                name="code"
                label={t('FOREVER_PAGE_INPUT_TEXT')}
                value={code}
                onValueChange={(value) => setCode(value)}
                required
                message={errorMessage}
                warning={!!errorMessage}
              />
              <Button type="submit" loading={loading}>
                {t('FOREVER_PAGE_BTN_LABEL')}
              </Button>
            </Space>
          </form>
        </GridLayout.Content>
      </GridLayout.Root>
      <footer>
        <TextWithLink size="xs" align="center">
          {footerText}
        </TextWithLink>
      </footer>
    </Layout>
  )
}

const Layout = styled.div({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  alignItems: 'center',
  height: '100vh',
  paddingBlock: theme.space.md,

  [mq.lg]: {
    paddingBlock: theme.space.xl,
  },
})

const Header = styled.header({
  display: 'flex',
  justifyContent: 'center',
})

const UppercaseTextField = styled(TextField)({
  textTransform: 'uppercase',
})

const TextWithLink = styled(Text)(linkStyles)
