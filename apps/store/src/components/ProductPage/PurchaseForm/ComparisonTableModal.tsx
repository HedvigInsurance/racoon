import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Button, Dialog, PlusIcon } from 'ui'
import type { Table } from '@/components/ComparisonTable/ComparisonTable.types'
import { TableMarkers } from '@/components/ComparisonTable/ComparisonTable.types'
import { DesktopComparisonTable } from '@/components/ComparisonTable/DesktopComparisonTable'
import { MobileComparisonTable } from '@/components/ComparisonTable/MobileComparisonTable'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'

type Props = {
  tiers: Array<ProductOfferFragment>
  selectedTierId: string
}

export const ComparisonTableModal = ({ tiers, selectedTierId }: Props) => {
  const { t } = useTranslation('purchase-form')
  const matchesMdAndUp = useBreakpoint('md')
  const { table, selectedTierDisplayName } = useTableData(tiers, selectedTierId)

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
            {!matchesMdAndUp && (
              <MobileComparisonTable {...table} defaultSelectedColumn={selectedTierDisplayName} />
            )}
            {matchesMdAndUp && (
              <DesktopComparisonTable {...table} selectedColumn={selectedTierDisplayName} />
            )}
          </GridLayout.Content>
        </Grid>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const removeDuplicates = <T,>(arr: T[]): T[] => Array.from(new Set(arr))

const getUniquePerilTitles = (tiers: Array<ProductOfferFragment>) => {
  const allPerils = tiers.flatMap((item) => item.variant.perils)
  const perilTitles = allPerils.map((item) => item.title)
  return removeDuplicates(perilTitles)
}

const offerHasPeril = (offer: ProductOfferFragment, perilTitle: string) =>
  offer.variant.perils.some((peril) => peril.title === perilTitle)

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
      case 'SE_DOG_BASIC':
      case 'SE_CAT_BASIC':
        return t('COMPARISON_TABLE_COLUMN_SE_DOG_BASIC')
      case 'SE_DOG_STANDARD':
      case 'SE_CAT_STANDARD':
        return t('COMPARISON_TABLE_COLUMN_SE_DOG_STANDARD')
      case 'SE_DOG_PREMIUM':
      case 'SE_CAT_PREMIUM':
        return t('COMPARISON_TABLE_COLUMN_SE_DOG_PREMIUM')
    }
  }
}

const useTableData = (tiers: Array<ProductOfferFragment>, selectedTierId: string) => {
  const getVeryShortVariantDisplayName = useGetVeryShortVariantDisplayName()

  const table = useMemo<Table>(() => {
    const head = [
      TableMarkers.EmptyHeader,
      ...tiers.map((tier) => {
        const headerValue = getVeryShortVariantDisplayName(tier.variant.typeOfContract) ?? ''

        if (!headerValue) {
          console.warn(
            `[ComparisonTableModal]: could not found tier display name to be used as table header for ${tier.variant.typeOfContract}. Using "" instead.`,
          )
        }

        return headerValue
      }),
    ]
    const body = getUniquePerilTitles(tiers).map((title) => [
      title,
      ...tiers.map((tier) =>
        offerHasPeril(tier, title) ? TableMarkers.Covered : TableMarkers.NotCovered,
      ),
    ])

    return { head, body }
  }, [tiers, getVeryShortVariantDisplayName])

  const selectedTier = tiers.find((tier) => tier.id === selectedTierId)
  const selectedTierDisplayName = selectedTier
    ? getVeryShortVariantDisplayName(selectedTier.variant.typeOfContract)
    : ''

  if (!selectedTierDisplayName) {
    console.warn(
      `[ComparisonTableModal]: could not found tier display name to be used as active table header ${selectedTier?.variant.typeOfContract}. Using "" instead.`,
    )
  }

  return { table, selectedTierDisplayName: selectedTierDisplayName || '' }
}

const Grid = styled(GridLayout.Root)({
  width: '100%',
  paddingInline: 0,
})
