import { datadogLogs } from '@datadog/browser-logs'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Text } from 'ui'
import * as TierLevelRadioGroup from '@/components/TierSelector/TierLevelRadioGroup'
import * as TierSelector from '@/components/TierSelector/TierSelector'
import type { Money, ProductOfferFragment } from '@/services/graphql/generated'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
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
  const locale = useRoutingLocale()
  const formatter = useFormatter()

  const deductibleLevels = useMemo(() => {
    const levels: Array<Deductible> = []

    offers.forEach((offer) => {
      if (offer.deductible) {
        levels.push({
          id: offer.id,
          price: offer.cost.net,
          title: offer.deductible.displayName,
          description: offer.deductible.tagline,
        })
      } else {
        datadogLogs.logger.warn(`Offer ${offer.id} has no deductible`)
      }
    })

    return levels
  }, [offers])

  return (
    <TierSelector.Root defaultOpen={true}>
      <TierSelector.Header>
        <div>
          <Text size="xs" color="textTranslucentSecondary">
            {t('DEDUCTIBLE_SELECTOR_TITLE')}
          </Text>
          {selectedOffer.deductible && (
            <Text size="xl">{selectedOffer.deductible.displayName}</Text>
          )}
        </div>
      </TierSelector.Header>

      <TierSelector.Content>
        <TierLevelRadioGroup.Root value={selectedOffer.id} onValueChange={onValueChange}>
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
          <Link href={PageLink.deductibleHelp({ locale })} target="_blank" rel="noopener">
            <Text as="span" size="xs">
              {t('DEDUCTIBLE_SELECTOR_FOOTER_LINK')}
            </Text>
          </Link>
        </TierSelector.Footer>
      </TierSelector.Content>
    </TierSelector.Root>
  )
}
