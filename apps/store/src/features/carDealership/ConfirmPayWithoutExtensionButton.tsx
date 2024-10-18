import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { BankIdIcon, Button, FullscreenDialog, Text, WarningTriangleIcon, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  onConfirm: () => void
}

export const ConfirmPayWithoutExtensionButton = (props: Props) => {
  const { t } = useTranslation('carDealership')

  const handleClick = () => {
    datadogRum.addAction('Car dearlership | Confirm pay without extension')
    props.onConfirm()
  }

  return (
    <FullscreenDialog.Root>
      <FullscreenDialog.Trigger asChild={true}>
        <Button variant="primary" fullWidth={true}>
          <SpaceFlex space={0.5} align="center">
            <BankIdIcon />
            {t('CONNECT_PAYMENT_BUTTON')}
          </SpaceFlex>
        </Button>
      </FullscreenDialog.Trigger>

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleClick} fullWidth={true}>
              {t('PAY_WITHOUT_EXTENSION_DIALOG_CONFIRM')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost" fullWidth={true}>
                {t('PAY_WITHOUT_EXTENSION_DIALOG_CANCEL')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <SpaceFlex direction="vertical" space={1} align="center">
          <WarningTriangleIcon size="1.5rem" color={theme.colors.signalAmberElement} />
          <TextWrapper>
            <Text size={{ _: 'md', lg: 'xl' }} align="center">
              {t('PAY_WITHOUT_EXTENSION_DIALOG_TITLE')}
            </Text>
            <Text size={{ _: 'md', lg: 'xl' }} color="textSecondary" align="center" balance={true}>
              {t('PAY_WITHOUT_EXTENSION_DIALOG_SUBTITLE')}
            </Text>
          </TextWrapper>
        </SpaceFlex>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const TextWrapper = styled.div({
  maxWidth: '38rem',
  marginInline: 'auto',
})
