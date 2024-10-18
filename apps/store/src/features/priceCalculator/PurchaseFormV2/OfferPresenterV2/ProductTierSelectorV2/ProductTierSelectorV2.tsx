import { assignInlineVars } from '@vanilla-extract/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { badgeFontColor } from 'ui/src/components/Badge/Badge.css'
import { Button } from 'ui/src/components/Button/Button'
import * as Dialog from 'ui/src/components/Dialog/Dialog'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import {
  Badge,
  framerTransitions,
  Heading,
  PlusIcon,
  Text,
  theme,
  tokens,
  xStack,
  yStack,
} from 'ui'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import * as CardRadioGroup from '../CardRadioGroup/CardRadioGroup'
import { TierComparisonDialogContent } from '../TierComparisonDialog/TierComparisonDialogContent'
import { item } from './ProductTierSelectorV2.css'

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onValueChange: (offerId: string) => void
}

export function ProductTierSelectorV2({ offers, selectedOffer, onValueChange }: Props) {
  const getVariantDescription = useGetVariantDescription()
  const formatter = useFormatter()
  const { t } = useTranslation('purchase-form')

  return (
    <>
      <Dialog.Root>
        <CardRadioGroup.Root value={selectedOffer.id} onValueChange={onValueChange}>
          {offers.map((offer, index) => (
            <CardRadioGroup.Item
              // NOTE: We want to avoid remounting selected deductible element when changing tiers
              // to avoid extra animation, hence index key
              key={index}
              value={offer.id}
              isSelected={selectedOffer.id === offer.id}
              className={item}
            >
              <div className={yStack()}>
                <div
                  className={xStack({
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'md',
                  })}
                >
                  <Heading as="h2" variant="standard.24">
                    {offer.variant.displayNameSubtype || offer.variant.displayName}
                  </Heading>
                  {isDefaultTier(offer) && (
                    <Badge
                      size="small"
                      color="pinkFill3"
                      style={assignInlineVars({ [badgeFontColor]: tokens.colors.gray1000 })}
                    >
                      {t('DEFAULT_TIER_LABEL')}
                    </Badge>
                  )}
                </div>
                <Heading as="h3" variant="standard.24" color="textSecondary">
                  {formatter.monthlyPrice(offer.cost.net)}
                </Heading>
              </div>
              <Text color="textSecondary" className={sprinkles({ marginTop: 'md' })}>
                {getVariantDescription(offer.variant.typeOfContract)}
              </Text>
              <AnimatePresence initial={false}>
                {offer.id === selectedOffer.id && (
                  <motion.div
                    transition={{
                      duration: framerTransitions.defaultDuration,
                      ...framerTransitions.easeInOutCubic,
                    }}
                    initial={{ height: 0, marginTop: 0, opacity: 0 }}
                    animate={{ height: 'fit-content', marginTop: theme.space.md, opacity: 1 }}
                    exit={{ height: 0, marginTop: 0, opacity: 0 }}
                  >
                    <Dialog.Trigger asChild>
                      <Button variant="secondary" fullWidth={true} size="medium">
                        {t('COMPARE_TIERS_LABEL')}
                      </Button>
                    </Dialog.Trigger>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardRadioGroup.Item>
          ))}
        </CardRadioGroup.Root>

        <Dialog.Trigger asChild>
          <Button
            variant="secondary"
            size="small"
            className={sprinkles({ alignSelf: 'center' })}
            Icon={<PlusIcon />}
            iconPosition="right"
          >
            {t('COMPARE_COVERAGE_BUTTON')}
          </Button>
        </Dialog.Trigger>

        <TierComparisonDialogContent tiers={offers} selectedTierId={selectedOffer.id} />
      </Dialog.Root>
    </>
  )
}

// TODO: fetch product variant descriptions from the API
const useGetVariantDescription = () => {
  const { t } = useTranslation('purchase-form')

  return (typeOfContract: string) => {
    switch (typeOfContract) {
      case 'SE_CAR_TRAFFIC':
        return t('SE_CAR_TRAFFIC_DESCRIPTION')
      case 'SE_CAR_HALF':
        return t('SE_CAR_HALF_DESCRIPTION')
      case 'SE_CAR_FULL':
        return t('SE_CAR_FULL_DESCRIPTION')
      case 'SE_DOG_BASIC':
        return t('SE_DOG_BASIC_DESCRIPTION')
      case 'SE_DOG_STANDARD':
        return t('SE_DOG_STANDARD_DESCRIPTION')
      case 'SE_DOG_PREMIUM':
        return t('SE_DOG_PREMIUM_DESCRIPTION')
      case 'SE_CAT_BASIC':
        return t('SE_CAT_BASIC_DESCRIPTION')
      case 'SE_CAT_STANDARD':
        return t('SE_CAT_STANDARD_DESCRIPTION')
      case 'SE_CAT_PREMIUM':
        return t('SE_CAT_PREMIUM_DESCRIPTION')
    }
  }
}

// Not configurable for now, but we can make it so if needed
const isDefaultTier = (offer: ProductOfferFragment) => {
  return offer.variant.typeOfContract.endsWith('_STANDARD')
}
