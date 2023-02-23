import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Text, theme, WarningTriangleIcon } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { useAppErrorContext } from '@/services/appErrors/AppErrorContext'
import { useErrorMessage } from '@/utils/useErrorMessage'

export const AppErrorDialog = () => {
  const { t } = useTranslation('common')
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
        center
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
        <IconWithText>
          <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
          <Text align="center">{errorMessage}</Text>
        </IconWithText>
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
