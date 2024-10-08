import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { useEditProductOffer } from '../hooks/useEditProductOffer'

type Props = {
  offer: ProductOfferFragment
}

export const EditCartItemDialog = ({ offer }: Props) => {
  const { t } = useTranslation(['cart', 'common'])
  const [editProductOffer, state] = useEditProductOffer()

  const handleConfirmEdit = () => editProductOffer({ offer })

  return (
    <FullscreenDialog.Root>
      <FullscreenDialog.Trigger asChild>
        <Button variant="secondary" size="medium" fullWidth>
          {t('CART_ENTRY_EDIT_BUTTON')}
        </Button>
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
          <CappedText size={{ _: 'md', lg: 'xl' }} align="center" balance={true}>
            {t('EDIT_CONFIRMATION_MODAL_PROMPT')}
          </CappedText>
        </FullscreenDialog.Title>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const CappedText = styled(Text)({ maxWidth: '42rem' })
