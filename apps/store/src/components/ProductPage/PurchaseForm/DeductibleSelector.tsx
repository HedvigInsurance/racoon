import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Text } from 'ui'
import { FormElement } from '@/components/ProductPage/PurchaseForm/PurchaseForm.constants'
import * as TierLevelRadioGroup from '@/components/TierSelector/TierLevelRadioGroup'
import * as TierSelector from '@/components/TierSelector/TierSelector'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onValueChange: (offerId: string) => void
}

export const DeductibleSelector = ({ offers, selectedOffer, onValueChange }: Props) => {
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()
  const { routingLocale } = useCurrentLocale()

  return (
    <TierSelector.Root>
      <TierSelector.Header>
        <Text>{t('DEDUCTIBLE_SELECTOR_TITLE')}</Text>
      </TierSelector.Header>

      <TierSelector.Content>
        <TierLevelRadioGroup.Root
          name={FormElement.DeductibleOfferId}
          value={selectedOffer.id}
          onValueChange={onValueChange}
        >
          {offers.map((offer) => (
            <TierLevelRadioGroup.Item
              key={offer.id}
              value={offer.id}
              price={formatter.monthlyPrice(offer.price)}
              // TODO: fetch deductible metadata from the API
              title="DEDUCTIBLE_TITLE"
              description="DEDUCTIBLE_DESCRIPTION"
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
