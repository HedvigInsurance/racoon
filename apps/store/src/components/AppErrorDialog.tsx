'use client'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Text, theme, WarningTriangleIcon } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { useAppErrorContext } from '@/services/appErrors/AppErrorContext'
import { useErrorMessage } from '@/utils/useErrorMessage'

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
              <Button type="button" variant="primary" fullWidth={true}>
                {t('ERROR_DIALOG_CLOSE')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <Wrapper>
          <WarningTriangleIcon size="1em" color={theme.colors.amber600} />
          <FullscreenDialog.Title asChild={true}>
            <Text align="center" size={{ _: 'md', lg: 'lg' }}>
              {t('GENERAL_ERROR_DIALOG_TITLE')}
            </Text>
          </FullscreenDialog.Title>
        </Wrapper>
        <Text align="center" size={{ _: 'md', lg: 'lg' }} color="textSecondary" balance={true}>
          {errorMessage}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xxs,
})
