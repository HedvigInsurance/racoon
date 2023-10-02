import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Button, Text, WarningTriangleIcon, theme } from 'ui'
import * as FullScreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ActionButton } from '@/components/ProductItem/ProductItem'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  onConfirm: () => void
}

// TODO: Deprecated
export const RemoveCarOfferActionButton = (props: Props) => {
  const { t } = useTranslation('carDealership')

  const handleClick = () => {
    datadogRum.addAction('Car dearlership | Offer removed')
    props.onConfirm()
  }

  return (
    <FullScreenDialog.Root>
      <FullScreenDialog.Trigger asChild={true}>
        <ActionButton variant="ghost">{t('REMOVE_EXTENSION_BUTTON')}</ActionButton>
      </FullScreenDialog.Trigger>

      <FullScreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleClick}>{t('REMOVE_EXTENSION_CONFIRM_BUTTON')}</Button>
            <FullScreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost">
                {t('REMOVE_EXTENSION_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullScreenDialog.Close>
          </>
        }
      >
        <Wrapper direction="vertical" space={1.5} align="center">
          <WarningTriangleIcon color={theme.colors.signalAmberElement} />
          <p>
            <Text size={{ _: 'md', lg: 'xl' }} align="center">
              {t('REMOVE_EXTENSION_MODAL_PROMPT_TITLE')}
            </Text>
            <Text size={{ _: 'md', lg: 'xl' }} color="textSecondary" align="center" balance={true}>
              {t('REMOVE_EXTENSION_MODAL_PROMPT_SUBTITLE')}
            </Text>
          </p>
        </Wrapper>
      </FullScreenDialog.Modal>
    </FullScreenDialog.Root>
  )
}

const Wrapper = styled(SpaceFlex)({
  maxWidth: '38rem',
  marginInline: 'auto',
})
