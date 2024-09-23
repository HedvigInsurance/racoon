'use client'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Heading, sprinkles, Text, theme, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useFormatter } from '@/utils/useFormatter'
import { pillow, priceLabel } from './ProductHeroV2.css'

export function ProductHeroV2({ className }: { className?: string }) {
  const productData = useProductData()
  const [selectedOffer] = useSelectedOffer()
  const formatter = useFormatter()
  const animateOfferChange = useAnimateOfferChange(selectedOffer?.id)

  return (
    <div className={clsx(yStack({ alignItems: 'center' }), className)}>
      <Pillow className={pillow} size="medium" {...productData.pillowImage} priority={true} />

      <motion.div animate={animateOfferChange} className={sprinkles({ textAlign: 'center' })}>
        <Heading as="h1" variant="standard.18" align="center">
          {productData.displayNameFull}
        </Heading>
        <Text color="textSecondary" size="md" className={priceLabel}>
          {selectedOffer && formatter.monthlyPrice(selectedOffer.cost.net)}
        </Text>
      </motion.div>
    </div>
  )
}

const useAnimateOfferChange = (selectedOfferId?: string | null) => {
  const totalDurationMs = 500

  const [hasChanged, setHasChanged] = useState(false)

  const prevOfferRef = useRef<string | null>(null)

  useEffect(() => {
    let timeoutId = 0
    if (prevOfferRef.current !== selectedOfferId && prevOfferRef.current != null) {
      setHasChanged(true)
      timeoutId = window.setTimeout(() => setHasChanged(false), totalDurationMs)
    }
    prevOfferRef.current = selectedOfferId ?? null
    return () => clearTimeout(timeoutId)
  }, [selectedOfferId])

  const animateProps = useMemo(() => {
    // NOTE: Mixing theme color to add some transparency
    const highlight = theme.colors.signalGreenHighlight
      .replace('hsl', 'hsla')
      .replace(')', ', 0.7)')
    const transparent = 'rgba(255,255,255,0)'
    return {
      backgroundColor: hasChanged ? [transparent, highlight, transparent] : transparent,
      transition: {
        ease: 'easeInOut',
        // Half of total in seconds
        duration: totalDurationMs / 1000,
      },
    }
  }, [hasChanged])
  return animateProps
}
