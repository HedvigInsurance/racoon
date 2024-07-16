import { datadogLogs } from '@datadog/browser-logs'
import { StoryblokComponent } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, Heading, PlusIcon, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { usePriceCalculatorDeductibleInfo } from '@/features/priceCalculator/priceCalculatorAtoms'
import type { Money, ProductOfferFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import * as CardRadioGroup from './CardRadioGroup'

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

export function DeductibleSelectorV2({ offers, selectedOffer, onValueChange }: Props) {
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
    <>
      <CardRadioGroup.Root value={selectedOffer.id} onValueChange={onValueChange}>
        {deductibleLevels.map((item) => (
          <CardRadioGroup.Item key={item.id} value={item.id}>
            <Heading as="h2" variant="standard.24">
              {item.title}
            </Heading>
            <Heading as="h3" variant="standard.24" color="textSecondary">
              {formatter.monthlyPrice(item.price)}
            </Heading>
            <Text color="textSecondary" className={sprinkles({ marginTop: 'md' })}>
              {item.description}
            </Text>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup.Root>
      <DeductibleInfo />
    </>
  )
}

function DeductibleInfo() {
  const { t } = useTranslation('purchase-form')
  const deductibleInfo = usePriceCalculatorDeductibleInfo()
  return (
    <FullscreenDialog.Root>
      <FullscreenDialog.Trigger asChild={true}>
        <Button variant="secondary" size="small" className={sprinkles({ alignSelf: 'center' })}>
          {t('DEDUCTIBLE_SELECTOR_FOOTER_LINK')}
          <PlusIcon size="1rem" />
        </Button>
      </FullscreenDialog.Trigger>
      <FullscreenDialog.Modal>
        <FullscreenDialog.Title className={sprinkles({ display: 'none' })}>
          {t('DEDUCTIBLE_SELECTOR_FOOTER_LINK')}
        </FullscreenDialog.Title>
        {deductibleInfo.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
