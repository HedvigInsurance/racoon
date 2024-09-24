'use client'

import {
  FloatingArrow,
  FloatingPortal,
  useFloating,
  autoUpdate,
  offset,
  shift,
  arrow,
} from '@floating-ui/react'
import { useTranslation } from 'next-i18next'
import { useState, useEffect, useRef } from 'react'
import { Text } from 'ui'
import { SHOP_CART_MENU_ITEM_ID } from '@/components/Header/ShoppingCartMenuItem/ShoppingCartMenuItem'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { toast, TOAST_BG_COLOR } from './CartToast.css'

const DEFAULT_SHOW_DURATION = 3500
const ARROW_HEIGHT = 8
const ARROW_WIDTH = ARROW_HEIGHT * 2
const VERTICAL_OFFSET = 12 + ARROW_HEIGHT
const HORIZONTAL_OFFSET = 0
const VIEWPORT_GUTTER = 12

export function CartToast() {
  const { t } = useTranslation('purchase-form')
  const show = useCartToastState()

  // To make sure floating ui lib can proper calculate the position of the toast
  // and react if anything changes we should keep the reference and floating elements
  // into state
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
  const [floatingElement, setFloatingElement] = useState<HTMLOutputElement | null>(null)
  const arrowRef = useRef<SVGSVGElement | null>(null)
  const { context, floatingStyles } = useFloating({
    open: show,
    placement: 'bottom-end',
    elements: {
      reference: referenceElement,
      floating: floatingElement,
    },
    middleware: [
      offset({ mainAxis: VERTICAL_OFFSET, crossAxis: HORIZONTAL_OFFSET }),
      shift({ padding: VIEWPORT_GUTTER }),
      arrow({ element: arrowRef }),
    ],
    transform: false,
    whileElementsMounted: autoUpdate,
  })

  // Workaround to get the reference element ('ShoppingCartMenuItem') while only rendering
  // new cart toast for new price calculator pages. We're gonna be able to remove this
  // when all price calculator pages are migrated to the new layout.
  useEffect(() => {
    setReferenceElement(document.getElementById(SHOP_CART_MENU_ITEM_ID))
  }, [])

  if (!show) return null

  return (
    <FloatingPortal>
      <output ref={setFloatingElement} className={toast} role="status" style={floatingStyles}>
        <Text size="xs">{t('CART_TOAST_HEADING')}</Text>
        <Text size="xs" color="signalGreenText">
          {t('CART_TOAST_CONTENT')}
        </Text>
        <FloatingArrow
          ref={arrowRef}
          context={context}
          width={ARROW_WIDTH}
          height={ARROW_HEIGHT}
          fill={TOAST_BG_COLOR}
          tipRadius={2}
        />
      </output>
    </FloatingPortal>
  )
}

// Derivate 'show' state from shopSession.cart.entries
function useCartToastState() {
  const { shopSession } = useShopSession()
  const [show, setShow] = useState(false)
  const prevCartEntryCount = useRef<number | null>(null)

  useEffect(() => {
    if (shopSession?.cart.entries.length == null) return

    // 'prevCartEntryCount' being 'null' means 'shopSession' just becaome available
    // for the first time, so we don't want to show the toast in this case
    if (
      prevCartEntryCount.current !== null &&
      shopSession.cart.entries.length > prevCartEntryCount.current
    ) {
      setShow(true)
      setTimeout(() => setShow(false), DEFAULT_SHOW_DURATION)
    }

    prevCartEntryCount.current = shopSession.cart.entries.length
  }, [shopSession?.cart.entries.length])

  return show
}
