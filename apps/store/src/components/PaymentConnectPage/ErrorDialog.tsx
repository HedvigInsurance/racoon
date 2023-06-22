import { useTranslation } from 'next-i18next'
import { Button, Text, WarningTriangleIcon, theme } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  open: boolean
  onRetry: () => void
}

export const ErrorDialog = (props: Props) => {
  const { t } = useTranslation()

  return (
    <FullscreenDialog.Root open={props.open}>
      <FullscreenDialog.Modal
        center={true}
        Footer={
          <Button onClick={props.onRetry} variant="primary">
            {t('PAYMENT_CONNECT_RETRY')}
          </Button>
        }
      >
        <SpaceFlex direction="vertical" align="center">
          <WarningTriangleIcon color={theme.colors.signalAmberElement} />
          <Text size={{ _: 'md', lg: 'lg' }}>{t('PAYMENT_CONNECT_FAILURE')}</Text>
        </SpaceFlex>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
