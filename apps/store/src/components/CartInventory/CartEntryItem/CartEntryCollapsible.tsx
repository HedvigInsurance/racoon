import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import React, { ReactNode, useState } from 'react'
import { ChevronIcon, Text, theme } from 'ui'
import type { Money, ProductOfferFragment } from '@/services/apollo/generated'
import { Features } from '@/utils/Features'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  defaultOpen: boolean
  price: Money
  cost: ProductOfferFragment['cost']
  children: ReactNode
}

export const CartEntryCollapsible = ({ defaultOpen, price, cost, children }: Props) => {
  const [open, setOpen] = useState(defaultOpen)
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <DetailsHeader>
        <Trigger>
          {t('VIEW_ENTRY_DETAILS_BUTTON')}
          <ChevronIcon color={theme.colors.textTertiary} size="1rem" />
        </Trigger>
        <PriceFlex>
          {Features.enabled('DISCOUNTS') && cost.discount.amount > 0 && (
            <Text color="textSecondary" strikethrough={true}>
              {formatter.monthlyPrice(cost.gross)}
            </Text>
          )}
          <Text>
            {Features.enabled('DISCOUNTS')
              ? formatter.monthlyPrice(cost.net)
              : formatter.monthlyPrice(price)}
          </Text>
        </PriceFlex>
      </DetailsHeader>
      <CollapsibleContent forceMount>
        <motion.div
          initial={open ? 'open' : 'closed'}
          transition={{
            ease: [0.65, 0.05, 0.36, 1],
            duration: 0.4,
          }}
          variants={{
            open: {
              height: 'var(--radix-collapsible-content-height)',
            },
            closed: {
              height: 0,
            },
          }}
          animate={open ? 'open' : 'closed'}
        >
          {children}
        </motion.div>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}

const CollapsibleContent = styled(Collapsible.Content)({
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes.md,
  overflow: 'hidden',
})

const PriceFlex = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  gap: theme.space.xs,
})

const Trigger = styled(Collapsible.Trigger)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  cursor: 'pointer',
  fontSize: theme.fontSizes.md,

  svg: {
    transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',

    ['[data-state=open] &']: {
      transform: 'rotate(180deg)',
    },
  },
})

const DetailsHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})
