'use client'
import { clsx } from 'clsx'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge, framerTransitions, Heading, sprinkles, Text, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useFormatter } from '@/utils/useFormatter'
import {
  pillow,
  pillowWrapper,
  priceLabel,
  priceWrapper,
  subTypeBadge,
  subTypeLabel,
} from './ProductHeroV2.css'

const TRAVEL_DISTANCE = '1em'
const ANIMATION: Variants = {
  pushDown: { y: TRAVEL_DISTANCE, opacity: 0 },
  original: { y: 0, opacity: 1 },
  pushUp: { y: `-${TRAVEL_DISTANCE}`, opacity: 0 },
}
const TRANSITION = { duration: 0.5, ...framerTransitions.easeInOutCubic }

export function ProductHeroV2({ className }: { className?: string }) {
  const productData = useProductData()
  const [selectedOffer] = useSelectedOffer()
  const subType = selectedOffer?.variant.displayNameSubtype
  const formatter = useFormatter()
  return (
    <div className={clsx(yStack({ alignItems: 'center' }), className)}>
      <div className={pillowWrapper}>
        <Pillow className={pillow} size="medium" {...productData.pillowImage} priority={true} />
        {subType && (
          <Badge className={subTypeBadge} size="big">
            {subType}
          </Badge>
        )}
      </div>

      <div className={sprinkles({ position: 'relative', textAlign: 'center' })}>
        <Heading as="h1" variant="standard.18" align="center">
          {productData.displayNameFull}
          {subType && <span className={subTypeLabel}>{` ${subType}`}</span>}
        </Heading>

        {selectedOffer && (
          <div className={priceWrapper}>
            <AnimatePresence>
              <motion.div
                key={selectedOffer.id}
                className={priceLabel}
                transition={TRANSITION}
                variants={ANIMATION}
                initial="pushDown"
                animate="original"
                exit="pushUp"
              >
                <Text color="textSecondary" size="md">
                  {formatter.monthlyPrice(selectedOffer.cost.net)}
                </Text>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
