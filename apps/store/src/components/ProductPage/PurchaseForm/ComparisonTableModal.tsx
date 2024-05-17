import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useMemo, type ReactNode } from 'react'
import { Button, Dialog } from 'ui'
import {
  TableMarkers,
  type Table,
  type Head,
  type Body,
} from '@/components/ComparisonTable/ComparisonTable.types'
import { DesktopComparisonTable } from '@/components/ComparisonTable/DesktopComparisonTable'
import { MobileComparisonTable } from '@/components/ComparisonTable/MobileComparisonTable'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'

type Props = {
  tiers: Array<ProductOfferFragment>
  selectedTierId: string
  children: ReactNode
}

export const ComparisonTableModal = ({ tiers, selectedTierId, children }: Props) => {
  const { t } = useTranslation('purchase-form')
  const variant = useResponsiveVariant('md')
  const { table, selectedTierDisplayName } = useTableData(tiers, selectedTierId)

  const handleOpenChange = (open: boolean) => {
    sendDialogEvent(open ? 'open' : 'close')
  }

  return (
    <FullscreenDialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

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
          <GridLayout.Content align="center" width={{ md: '2/3', xxl: '1/2' }}>
            {variant === 'mobile' && (
              <MobileComparisonTable {...table} defaultSelectedColumn={selectedTierDisplayName} />
            )}
            {variant === 'desktop' && (
              <DesktopComparisonTable {...table} selectedColumn={selectedTierDisplayName} />
            )}
          </GridLayout.Content>
        </Grid>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const removeDuplicatesByTitle = <T extends { title: string }>(arr: Array<T>): Array<T> => {
  const seenTitles = new Set<string>()
  return arr.filter((item) => {
    if (!seenTitles.has(item.title)) {
      seenTitles.add(item.title)
      return true
    }

    return false
  })
}

const getUniquePerils = (tiers: Array<ProductOfferFragment>) => {
  const allPerils = tiers
    .flatMap((item) => item.variant.perils)
    .map(({ title, description }) => ({ title, description }))
  return removeDuplicatesByTitle(allPerils)
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
    const head: Head = [
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
    const body: Body = getUniquePerils(tiers).map((peril) => [
      { title: peril.title, description: peril.description },
      ...tiers.map((tier) =>
        offerHasPeril(tier, peril.title) ? TableMarkers.Covered : TableMarkers.NotCovered,
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
