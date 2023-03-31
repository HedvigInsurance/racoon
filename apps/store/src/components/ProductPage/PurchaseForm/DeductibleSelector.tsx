import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useMemo } from 'react'
import { Text } from 'ui'
import { FormElement } from '@/components/ProductPage/PurchaseForm/PurchaseForm.constants'
import * as TierLevelRadioGroup from '@/components/TierSelector/TierLevelRadioGroup'
import * as TierSelector from '@/components/TierSelector/TierSelector'
import { Money, ProductOfferFragment } from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'

type Deductible = {
  id: string
  price: Money
  title: string
  description: string
}

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onValueChange: (offerId: string) => void
}

export const DeductibleSelector = ({ offers, selectedOffer, onValueChange }: Props) => {
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()
  const { routingLocale } = useCurrentLocale()

  const deductibleLevels = useMemo(() => {
    const levels: Array<Deductible> = []

    offers.forEach((offer) => {
      if (offer.deductible) {
        levels.push({
          id: offer.id,
          price: offer.price,
          title: offer.deductible.displayName,
          description: offer.deductible.tagline,
        })
      } else {
        datadogLogs.logger.warn(`Offer ${offer.id} has no deductible`)
      }
    })

    // Sort deductibles based on monthly price
    const sortedLevels = levels.sort((a, b) => {
      if (a.price.amount < b.price.amount) return -1
      if (a.price.amount > b.price.amount) return 1
      return 0
    })

    return sortedLevels
  }, [offers])

  return (
    <TierSelector.Root defaultOpen={true}>
      <TierSelector.Header>
        <Text>{t('DEDUCTIBLE_SELECTOR_TITLE')}</Text>
        {selectedOffer.deductible && (
          <ToggleText>{selectedOffer.deductible.displayName}</ToggleText>
        )}
      </TierSelector.Header>

      <TierSelector.Content>
        <TierLevelRadioGroup.Root
          name={FormElement.DeductibleOfferId}
          value={selectedOffer.id}
          onValueChange={onValueChange}
        >
          {deductibleLevels.map((item) => (
            <TierLevelRadioGroup.Item
              key={item.id}
              value={item.id}
              price={formatter.monthlyPrice(item.price)}
              title={item.title}
              description={item.description}
            />
          ))}
        </TierLevelRadioGroup.Root>
        <TierSelector.Footer>
          <Link href={PageLink.deductibleHelp({ locale: routingLocale })}>
            <Text as="span" size="xs">
              {t('DEDUCTIBLE_SELECTOR_FOOTER_LINK')}
            </Text>
          </Link>
        </TierSelector.Footer>
      </TierSelector.Content>
    </TierSelector.Root>
  )
}

const ToggleText = styled(Text)({
  '[data-state=open] &': { display: 'none' },
})
