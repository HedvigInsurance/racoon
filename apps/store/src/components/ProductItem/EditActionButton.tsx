import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Balancer from 'react-wrap-balancer'
import { Button, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { ActionButton } from './ProductItem'
import { useEditProductOffer } from './useEditProductOffer'

type Props = {
  offer: ProductOfferFragment
}

export const EditActionButton = ({ offer }: Props) => {
  const { t } = useTranslation(['cart', 'common'])
  const [editProductOffer, state] = useEditProductOffer()

  const handleConfirmEdit = () => editProductOffer({ offer })

  return (
    <FullscreenDialog.Root>
      <FullscreenDialog.Trigger asChild={true}>
        <ActionButton>{t('CART_ENTRY_EDIT_BUTTON')}</ActionButton>
      </FullscreenDialog.Trigger>

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleConfirmEdit} loading={state === 'loading'} fullWidth={true}>
              {t('EDIT_CONFIRMATION_MODAL_CONTINUE')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost" fullWidth={true}>
                {t('EDIT_CONFIRMATION_MODAL_CANCEL')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <FullscreenDialog.Title asChild={true}>
          <CappedText size={{ _: 'md', lg: 'xl' }} align="center">
            <Balancer>{t('EDIT_CONFIRMATION_MODAL_PROMPT')}</Balancer>
          </CappedText>
        </FullscreenDialog.Title>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const CappedText = styled(Text)({ maxWidth: '42rem' })
