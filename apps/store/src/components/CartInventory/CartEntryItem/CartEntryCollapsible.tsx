import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import React, { ReactNode } from 'react'
import { ChevronIcon, Text, theme } from 'ui'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  price: string
  children: ReactNode
}

export const CartEntryCollapsible = ({ open, onOpenChange, price, children }: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange}>
      <DetailsHeader>
        <Trigger>
          {t('VIEW_ENTRY_DETAILS_BUTTON')}
          <ChevronIcon color={theme.colors.textTertiary} size="1rem" />
        </Trigger>
        <PriceFlex>
          <Text>{price}</Text>
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
})

const Trigger = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  fontSize: theme.fontSizes.md,

  svg: {
    transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',

    ['[data-state=open] &']: {
      transform: 'rotate(180deg)',
    },
  },
})

const DetailsHeader = styled(Collapsible.Trigger)({
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  width: '100%',
})
