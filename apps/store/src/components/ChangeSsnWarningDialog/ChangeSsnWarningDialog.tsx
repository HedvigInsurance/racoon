import { useTranslation } from 'next-i18next'
import { useState, useCallback } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { FullscreenDialog } from 'ui/src/components/Dialog/FullscreenDialog'
import { Text, WarningTriangleIcon, theme } from 'ui'
import { resetAuthTokens } from '@/services/authApi/persist'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { title } from './ChangeSsnWarningDialog.css'

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

    resetAuthTokens()
    await resetShopSession()

    if (onAccept) {
      await onAccept()
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
        <FullscreenDialog.Title>
          <Text className={title}>
            <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
            {t('CHANGE_SSN_TITLE')}
          </Text>
        </FullscreenDialog.Title>
        <Text color="textSecondary" align="center">
          {t('CHANGE_SSN_DESCRIPTION')}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
