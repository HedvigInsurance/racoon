import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { Button, type ButtonProps } from 'ui/src/components/Button/Button'
import { useShowQuickAdd } from './useShowQuickAdd'

type Props = Omit<ButtonProps<'button'>, 'onClick' | 'children'>

export function DismissButton(props: Props) {
  const { t } = useTranslation('cart')
  const [, setShow] = useShowQuickAdd()

  const handleDismiss = () => {
    datadogRum.addAction('Quick Add Hide')
    setShow(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <Button size="medium" {...props} onClick={handleDismiss}>
      {t('QUICK_ADD_DISMISS')}
    </Button>
  )
}
