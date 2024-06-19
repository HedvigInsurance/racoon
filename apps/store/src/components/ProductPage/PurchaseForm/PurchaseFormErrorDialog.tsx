import { useTranslation } from 'next-i18next'
import { Balancer } from 'react-wrap-balancer'
import { Button, Text, theme, WarningTriangleIcon } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  errorMessage?: string
  open: boolean
  onOpenChange: () => void
  onEditClick: () => void
}
export const PurchaseFormErrorDialog = (props: Props) => {
  const { t } = useTranslation('purchase-form')
  return (
    <FullscreenDialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button type="button" onClick={props.onEditClick} fullWidth={true}>
              {t('GENERAL_ERROR_DIALOG_PRIMARY_BUTTON')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost" fullWidth={true}>
                {t('DIALOG_BUTTON_CANCEL', { ns: 'common' })}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <SpaceFlex direction="vertical" align="center" space={0}>
              <Text size={{ _: 'lg', lg: 'xl' }}>
                <SpaceFlex space={0.25} align="center">
                  <WarningTriangleIcon size="1em" color={theme.colors.signalAmberElement} />
                  {t('GENERAL_ERROR_DIALOG_TITLE', { ns: 'common' })}
                </SpaceFlex>
              </Text>
              <Balancer ratio={0.5}>
                <Text size={{ _: 'lg', lg: 'xl' }} align="center" color="textSecondary">
                  {props.errorMessage ? props.errorMessage : t('GENERAL_ERROR_DIALOG_PROMPT')}
                </Text>
              </Balancer>
            </SpaceFlex>
          </GridLayout.Content>
        </GridLayout.Root>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
