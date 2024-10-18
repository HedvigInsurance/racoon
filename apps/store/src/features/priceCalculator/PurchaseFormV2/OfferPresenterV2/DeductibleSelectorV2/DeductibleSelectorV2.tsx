import { datadogLogs } from '@datadog/browser-logs'
import { StoryblokComponent } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { FullscreenDialog } from 'ui/src/components/Dialog/FullscreenDialog'
import { Badge, Button, Heading, PlusIcon, sprinkles, Text, xStack, yStack } from 'ui'
import { usePriceCalculatorDeductibleInfo } from '@/features/priceCalculator/priceCalculatorAtoms'
import type { Money, ProductOfferFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import * as CardRadioGroup from '../CardRadioGroup/CardRadioGroup'
import { priceLabel } from './DeductibleSelectorV2.css'

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
        {deductibleLevels.map((item, index) => (
          <CardRadioGroup.Item
            // NOTE: We want to avoid remounting selected deductible element when changing tiers
            // to avoid extra animation, hence index key
            key={index}
            value={item.id}
            isSelected={selectedOffer.id === item.id}
          >
            <div className={xStack({ gap: 'xs' })}>
              <div className={yStack({ flexGrow: 1, gap: 'xs' })}>
                <div
                  className={xStack({
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'md',
                  })}
                >
                  <Heading as="h2" variant="standard.24">
                    {item.title}
                  </Heading>
                  <Badge size="small" className={priceLabel}>
                    {formatter.monthlyPrice(item.price)}
                  </Badge>
                </div>
                <Text size="xs" color="textSecondary">
                  {item.description}
                </Text>
              </div>
            </div>
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
        <Button
          variant="secondary"
          size="small"
          className={sprinkles({ alignSelf: 'center' })}
          Icon={<PlusIcon size="1rem" />}
          iconPosition="right"
        >
          {t('DEDUCTIBLE_SELECTOR_FOOTER_LINK')}
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
