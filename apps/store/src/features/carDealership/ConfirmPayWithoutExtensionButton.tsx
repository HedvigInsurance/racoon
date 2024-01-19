import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { BankIdIcon, Button, Text, WarningTriangleIcon, theme } from 'ui'
import * as FullScreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
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
    <FullScreenDialog.Root>
      <FullScreenDialog.Trigger asChild={true}>
        <Button variant="primary">
          <SpaceFlex space={0.5} align="center">
            <BankIdIcon />
            {t('CONNECT_PAYMENT_BUTTON')}
          </SpaceFlex>
        </Button>
      </FullScreenDialog.Trigger>

      <FullScreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleClick}>{t('PAY_WITHOUT_EXTENSION_DIALOG_CONFIRM')}</Button>
            <FullScreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost">
                {t('PAY_WITHOUT_EXTENSION_DIALOG_CANCEL')}
              </Button>
            </FullScreenDialog.Close>
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
      </FullScreenDialog.Modal>
    </FullScreenDialog.Root>
  )
}

const TextWrapper = styled.div({
  maxWidth: '38rem',
  marginInline: 'auto',
})
