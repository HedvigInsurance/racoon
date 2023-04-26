import styled from '@emotion/styled'
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, WarningTriangleIcon, theme } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { resetAuthTokens } from '@/services/authApi/persist'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type Props = {
  open: boolean
  onAccept?: (() => void) | (() => Promise<void>)
  onDecline: () => void
}

export const ChangeSsnWarningDialog = ({ open, onAccept, onDecline }: Props) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('purchase-form')
  const { reset: resetShopSession } = useShopSession()

  const handleAccept = useCallback(async () => {
    setLoading(true)

    await resetShopSession()
    resetAuthTokens()

    if (onAccept) {
      if (onAccept instanceof Promise) {
        await onAccept()
      } else {
        onAccept()
      }
    }

    setLoading(false)
  }, [onAccept, resetShopSession])

  return (
    <FullscreenDialog.Root open={open} onOpenChange={onDecline}>
      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button loading={loading} onClick={handleAccept}>
              {t('CHANGE_SSN_BUTTON')}
            </Button>
            <Button variant="ghost" onClick={onDecline}>
              {t('DIALOG_BUTTON_CANCEL', { ns: 'common' })}
            </Button>
          </>
        }
      >
        <IconWithText>
          <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
          <Text align="center">{t('CHANGE_SSN_TITLE')}</Text>
        </IconWithText>
        <Text color="textSecondary" align="center">
          {t('CHANGE_SSN_DESCRIPTION')}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const IconWithText = styled(Text)({
  gap: theme.space.xs,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
