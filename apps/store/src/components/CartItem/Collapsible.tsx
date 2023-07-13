import styled from '@emotion/styled'
import * as RadixCollapsible from '@radix-ui/react-collapsible'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { ChevronIcon, Text, theme } from 'ui'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  cost: ProductOfferFragment['cost']
  children: ReactNode
}

export const Collapsible = ({ open, onOpenChange, cost, children }: Props) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const hasDiscountApplied = cost.discount.amount > 0

  return (
    <RadixCollapsible.Root open={open} onOpenChange={onOpenChange}>
      <DetailsHeader>
        <Trigger>
          {t('VIEW_ENTRY_DETAILS_BUTTON')}
          <ChevronIcon color={theme.colors.textTertiary} size="1rem" />
        </Trigger>
        <PriceFlex>
          {hasDiscountApplied && (
            <Text color="textSecondary" strikethrough={true}>
              {formatter.monthlyPrice(cost.gross)}
            </Text>
          )}
          <Text>{formatter.monthlyPrice(cost.net)}</Text>
        </PriceFlex>
      </DetailsHeader>
      <CollapsibleContent forceMount={true}>
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
    </RadixCollapsible.Root>
  )
}

const CollapsibleContent = styled(RadixCollapsible.Content)({
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes.md,
  overflow: 'hidden',

  paddingInline: theme.space.lg,
  cursor: 'initial',
})

const PriceFlex = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  gap: theme.space.xs,
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

const DetailsHeader = styled(RadixCollapsible.Trigger)({
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  width: '100%',

  paddingInline: theme.space.lg,
  paddingTop: theme.space.md,
})
