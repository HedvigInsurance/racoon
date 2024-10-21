'use client'
import clsx from 'clsx'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useRef } from 'react'
import { Badge, framerTransitions, Heading, sprinkles, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useIsPriceIntentStateReady } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useHasScrolledPast } from '@/components/ProductPage/ScrollPast/useHasScrolledPast'
import { useFormatter } from '@/utils/useFormatter'
import {
  pillow,
  pillowWrapper,
  priceLabel,
  priceWrapper,
  productHeroWrapper,
  subTypeBadge,
  subTypeLabel,
} from './ProductHeroV2.css'
import { StickyProductHeader } from './StickyProductHeader/StickyProductHeader'
import { useCondensedProductHero } from './useCondensedProductHero'

const TRAVEL_DISTANCE = '1em'
const ANIMATION: Variants = {
  pushDown: { y: TRAVEL_DISTANCE, opacity: 0 },
  original: { y: 0, opacity: 1 },
  pushUp: { y: `-${TRAVEL_DISTANCE}`, opacity: 0 },
}
const TRANSITION = { duration: 0.3, ...framerTransitions.easeInOutCubic }

export function ProductHeroV2() {
  const ref = useRef(null)
  const formatter = useFormatter()
  const productData = useProductData()
  const [selectedOffer] = useSelectedOffer()
  const isReady = useIsPriceIntentStateReady()
  const hasScrolledPast = useHasScrolledPast({ targetRef: ref, offset: -100 })
  const subType = selectedOffer?.variant.displayNameSubtype

  const productHeading = (
    <>
      <Heading as="h1" variant="standard.18">
        {productData.displayNameFull}
        {subType && <span className={subTypeLabel}>{` ${subType}`}</span>}
      </Heading>

      {selectedOffer && (
        <div className={priceWrapper}>
          <AnimatePresence initial={false}>
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
    </>
  )

  return (
    <>
      {isReady && (
        <StickyProductHeader hasScrolledPast={hasScrolledPast}>
          {
            <>
              <Pillow size="small" {...productData.pillowImage} priority={true} />
              <div>{productHeading}</div>
            </>
          }
        </StickyProductHeader>
      )}

      {isReady && (
        <div ref={ref}>
          <ProductHeroPillow subType={subType}>{productHeading}</ProductHeroPillow>
        </div>
      )}
    </>
  )
}

function ProductHeroPillow({ children, subType }: { children: ReactNode; subType?: string }) {
  const { pillowImage } = useProductData()
  const isCondensedProductHero = useCondensedProductHero()

  return (
    <div
      className={clsx(productHeroWrapper.base, isCondensedProductHero && productHeroWrapper.hidden)}
    >
      <div className={pillowWrapper}>
        <Pillow className={pillow} size={{ lg: 'xxlarge' }} {...pillowImage} priority={true} />
        {subType && (
          <Badge className={subTypeBadge} size="big">
            {subType}
          </Badge>
        )}
      </div>

      <div className={sprinkles({ position: 'relative', textAlign: 'center' })}>{children}</div>
    </div>
  )
}
