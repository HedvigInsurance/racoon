import { useTranslation } from 'next-i18next'
import { Balancer } from 'react-wrap-balancer'
import { Button, Text, theme, WarningTriangleIcon } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { useAppErrorContext } from '@/services/appErrors/AppErrorContext'
import { useErrorMessage } from '@/utils/useErrorMessage'
import { SpaceFlex } from './SpaceFlex/SpaceFlex'

export const AppErrorDialog = () => {
  const { t } = useTranslation()
  const { lastError, setLastError } = useAppErrorContext()
  const errorMessage = useErrorMessage(lastError)
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setLastError(null)
    }
  }

  return (
    <FullscreenDialog.Root open={!!lastError} onOpenChange={handleOpenChange}>
      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="primary">
                {t('ERROR_DIALOG_CLOSE')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <SpaceFlex space={0.25} align="center">
          <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
          <Text align="center" size={{ _: 'md', lg: 'lg' }}>
            {t('GENERAL_ERROR_DIALOG_TITLE')}
          </Text>
        </SpaceFlex>
        <Text align="center" size={{ _: 'md', lg: 'lg' }} color="textSecondary">
          <Balancer>{errorMessage}</Balancer>
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
