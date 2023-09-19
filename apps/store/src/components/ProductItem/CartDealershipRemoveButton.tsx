import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Button, Text } from 'ui'
import * as FullScreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ActionButton } from './ProductItem'

type Props = {
  onRemoveContract: () => void
}

export const CartDealershipRemoveButton = (props: Props) => {
  const { t } = useTranslation('cart')

  const handleRemoveContract = () => {
    props.onRemoveContract()
  }

  return (
    <FullScreenDialog.Root>
      <FullScreenDialog.Trigger asChild={true}>
        <ActionButton>{t('REMOVE_ENTRY_BUTTON')}</ActionButton>
      </FullScreenDialog.Trigger>

      <FullScreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleRemoveContract}>{t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON')}</Button>
            <FullScreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost">
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullScreenDialog.Close>
          </>
        }
      >
        <TextWrapper>
          <Text size={{ _: 'md', lg: 'xl' }} align="center">
            {t('REMOVE_CONTRACT_MODAL_PROMPT_TITLE')}
          </Text>
          <Text size={{ _: 'md', lg: 'xl' }} color="textSecondary" align="center" balance={true}>
            {t('REMOVE_CONTRACT_MODAL_PROMPT_SUBTITLE')}
          </Text>
        </TextWrapper>
      </FullScreenDialog.Modal>
    </FullScreenDialog.Root>
  )
}

const TextWrapper = styled.div({
  maxWidth: '38rem',
  marginInline: 'auto',
})
