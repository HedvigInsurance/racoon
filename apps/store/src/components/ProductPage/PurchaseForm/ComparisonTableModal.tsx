import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Dialog, PlusIcon } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { sendDialogEvent } from '@/utils/dialogEvent'
import * as ComparisonTable from './ComparisonTable/ComparisonTable'

type Props = {
  offers: PriceIntent['offers']
  selectedOfferId: string
}

export const ComparisonTableModal = ({ offers, selectedOfferId }: Props) => {
  const getVeryShortVariantDisplayName = useGetVeryShortVariantDisplayName()
  const { t } = useTranslation('purchase-form')
  const getUniquePerilTitles = () => {
    const allPerils = offers.flatMap((offer) => offer.variant.perils)
    const perilTitles = allPerils.map((peril) => peril.title)
    return removeDuplicates(perilTitles)
  }

  const handleOpenChange = (open: boolean) => {
    sendDialogEvent(open ? 'open' : 'close')
  }

  return (
    <FullscreenDialog.Root onOpenChange={handleOpenChange}>
      <SpaceFlex direction="vertical" align="center">
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="small">
            <SpaceFlex space={0.5} align="center">
              <PlusIcon />
              {t('COMPARE_COVERAGE_BUTTON')}
            </SpaceFlex>
          </Button>
        </Dialog.Trigger>
      </SpaceFlex>

      <FullscreenDialog.Modal
        center
        Footer={
          <>
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="secondary">
                {t('CLOSE_COMPARISON_MODAL')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <Grid>
          <GridLayout.Content align="center" width={{ md: '2/3', xl: '1/2', xxl: '1/3' }}>
            <ComparisonTable.Root>
              <ComparisonTable.Head>
                <ComparisonTable.Header />
                {offers.map((offer) => (
                  <ComparisonTable.Header
                    key={offer.id}
                    active={isSelectedOffer(offer, selectedOfferId)}
                  >
                    {getVeryShortVariantDisplayName(offer.variant.typeOfContract)}
                  </ComparisonTable.Header>
                ))}
              </ComparisonTable.Head>
              <ComparisonTable.Body>
                {getUniquePerilTitles().map((perilTitle) => (
                  <ComparisonTable.Row key={perilTitle}>
                    <ComparisonTable.TitleDataCell>{perilTitle}</ComparisonTable.TitleDataCell>
                    {offers.map((offer) => (
                      <ComparisonTable.DataCell
                        key={offer.id}
                        active={isSelectedOffer(offer, selectedOfferId)}
                      >
                        {offerHasPeril(offer, perilTitle) ? (
                          <ComparisonTable.CheckIcon />
                        ) : (
                          <ComparisonTable.MissingIcon />
                        )}
                      </ComparisonTable.DataCell>
                    ))}
                  </ComparisonTable.Row>
                ))}
              </ComparisonTable.Body>
            </ComparisonTable.Root>
          </GridLayout.Content>
        </Grid>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const removeDuplicates = <T,>(arr: T[]): T[] => Array.from(new Set(arr))

const offerHasPeril = (offer: ProductOfferFragment, perilTitle: string) =>
  offer.variant.perils.some((peril) => peril.title === perilTitle)

const isSelectedOffer = (offer: ProductOfferFragment, selectedOfferId: string) => {
  if (offer.id === selectedOfferId) return true
  return false
}

// TODO: fetch from API
const useGetVeryShortVariantDisplayName = () => {
  const { t } = useTranslation('purchase-form')

  return (typeOfContract: string) => {
    switch (typeOfContract) {
      case 'SE_CAR_FULL':
        return t('COMPARISON_TABLE_COLUMN_SE_CAR_FULL')
      case 'SE_CAR_HALF':
        return t('COMPARISON_TABLE_COLUMN_SE_CAR_HALF')
      case 'SE_CAR_TRAFFIC':
        return t('COMPARISON_TABLE_COLUMN_SE_CAR_TRAFFIC')
    }
  }
}

const Grid = styled(GridLayout.Root)({
  width: '100%',
  paddingInline: 0,
})
