'use client'

import { FloatingArrow, useFloating, autoUpdate, offset, shift, arrow } from '@floating-ui/react'
import { useTranslation } from 'next-i18next'
import { useRef, useState } from 'react'
import { Text } from 'ui'
import { useCartToast } from '@/appComponents/providers/CartToastProvider'
import { toast, TOAST_BG_COLOR } from './CartToast.css'

const ARROW_HEIGHT = 8
const ARROW_WIDTH = ARROW_HEIGHT * 2
const VERTICAL_OFFSET = 12 + ARROW_HEIGHT
const HORIZONTAL_OFFSET = 0
const VIEWPORT_GUTTER = 12

type Props = {
  anchorElement: HTMLElement | null
}

export function CartToast({ anchorElement }: Props) {
  const { t } = useTranslation('purchase-form')
  const [show] = useCartToast()

  const [floatingElement, setFloatingElement] = useState<HTMLOutputElement | null>(null)
  const arrowRef = useRef<SVGSVGElement | null>(null)
  const { context, floatingStyles } = useFloating({
    open: show,
    placement: 'bottom-end',
    elements: {
      reference: anchorElement,
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

  if (!show) return null

  return (
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
  )
}
