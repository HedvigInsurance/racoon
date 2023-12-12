import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { useShowQuickAdd } from './useShowQuickAdd'

export const DismissButton = () => {
  const { t } = useTranslation('cart')
  const [, setShow] = useShowQuickAdd()

  const handleDismiss = () => {
    datadogRum.addAction('Quick Add Hide')
    setShow(false)
  }

  return (
    <Button size="medium" variant="ghost" fullWidth={true} onClick={handleDismiss}>
      {t('QUICK_ADD_DISMISS')}
    </Button>
  )
}
