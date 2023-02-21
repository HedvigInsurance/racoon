import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme, mq } from 'ui'
import {
  MENU_BAR_HEIGHT_MOBILE,
  MENU_BAR_HEIGHT_DESKTOP,
  MENU_BAR_HEIGHT_PX,
} from '@/components/Header/HeaderStyles'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { useScrollState } from '@/utils/useScrollState'
import { zIndexes } from '@/utils/zIndex'

const TABLIST_HEIGHT = '2.5rem'

export const Content = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  isolation: 'isolate',
})

export const OverviewSection = styled.section({
  marginTop: `calc(-${TABLIST_HEIGHT} - ${theme.space.xs})`,
  [mq.md]: {
    marginTop: `calc(-${TABLIST_HEIGHT} - ${theme.space.md})`,
  },
  [mq.lg]: {
    marginTop: 0,
  },
})

const StickyHeader = styled(motion.div)({
  position: 'sticky',
  top: `calc(${theme.space.sm} + ${MENU_BAR_HEIGHT_MOBILE})`,
  zIndex: zIndexes.tabs,
  paddingInline: theme.space.md,

  [mq.md]: {
    top: `calc(${theme.space.sm} + ${MENU_BAR_HEIGHT_DESKTOP})`,
    paddingInline: theme.space.lg,
  },
  [mq.lg]: {
    position: 'fixed',
    top: `calc(${theme.space.md} + ${MENU_BAR_HEIGHT_DESKTOP})`,
    paddingInline: theme.space.xl,
  },
})

export const AnimatedHeader = ({ children }: { children: React.ReactNode }) => {
  const state = useScrollState({ threshold: MENU_BAR_HEIGHT_PX })
  const scrollUp = state === 'SCROLL_DOWN' || state === 'BELOW'

  return (
    <StickyHeader
      animate={{ top: scrollUp ? theme.space.md : undefined }}
      transition={theme.transitions.framer.easeInOutCubic}
    >
      {children}
    </StickyHeader>
  )
}

export const StyledProductVariantSelector = styled(ProductVariantSelector)({
  minWidth: '12.5rem',
  width: 'fit-content',
  marginTop: theme.space.xs,
})

export const triggerListStyles = css({
  display: 'flex',
  gap: theme.space.xs,
  height: TABLIST_HEIGHT,
})

export const triggerStyles = css({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  textAlign: 'center',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xs,
  fontSize: theme.fontSizes.md,
  lineHeight: theme.fontSizes.xl,
  color: theme.colors.dark,
  backgroundColor: theme.colors.grayTranslucent100,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.radius.sm,

  '&[data-state=active]': {
    paddingInline: theme.space.xxxl,
    color: theme.colors.dark,
    backgroundColor: theme.colors.grayTranslucent400,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.gray200,
      transition: `background-color ${theme.transitions.hover}`,

      '&[data-state=active]': {
        backgroundColor: theme.colors.grayTranslucent500,
      },
    },
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.purple500}`,
  },
})
