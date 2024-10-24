import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { useState } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { Space } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { TextField } from '@/components/TextField/TextField'
import { TextWithLink } from '@/components/TextWithLink'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useRedeemCampaign } from '@/utils/useCampaign'
import { layout } from './ForeverPage.css'
import { usePrintTextEffect } from './usePrintTextEffect'

export type Props = { code: string }

export const ForeverPage = ({ code: initialCode }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [code, setCode] = useState('')
  usePrintTextEffect({ value: initialCode, onValueChange: setCode })

  const shopSessionId = useShopSessionId()
  const locale = useRoutingLocale()
  const redirectUrl = PageLink.store({ locale })
  const [addCampaign, { errorMessage, loading, called }] = useRedeemCampaign({
    shopSessionId: shopSessionId ?? '',
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
    <div className={layout}>
      <GridLayout.Root as="main">
        <GridLayout.Content width="1/3" align="center">
          <form onSubmit={handleSubmit}>
            <Space y={errorMessage ? 1 : 0.25}>
              <TextField
                name="code"
                label={t('FOREVER_PAGE_INPUT_TEXT')}
                value={code}
                onValueChange={(value) => setCode(value)}
                required={true}
                message={errorMessage}
                warning={!!errorMessage}
                upperCaseInput={true}
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
    </div>
  )
}
