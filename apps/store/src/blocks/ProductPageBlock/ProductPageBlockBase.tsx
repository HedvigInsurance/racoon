import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { theme, mq } from 'ui'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { zIndexes } from '@/utils/zIndex'

const TABLIST_HEIGHT = '2.5rem'

export const VariantSelector = () => {
  return (
    <VariantSelectorWrapper>
      <StyledProductVariantSelector />
    </VariantSelectorWrapper>
  )
}

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  backgroundColor: theme.colors.greenFill1,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',

  ':hover, :focus-within': {
    backgroundColor: theme.colors.greenFill3,
  },
})

export const Content = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  isolation: 'isolate',
})

export const OverviewSection = styled.section({
  marginTop: `calc(-${TABLIST_HEIGHT} - ${theme.space.xs})`,
  [mq.md]: { marginTop: `calc(-${TABLIST_HEIGHT} - ${theme.space.md})` },
})

export const StickyHeader = styled.div({
  position: 'sticky',
  top: theme.space.sm,
  zIndex: zIndexes.tabs,
  paddingInline: theme.space.md,

  [mq.md]: {
    paddingInline: theme.space.lg,
  },
  [mq.lg]: {
    top: theme.space.md,
    paddingInline: theme.space.xl,
  },
})

const VariantSelectorWrapper = styled.div({
  width: 'fit-content',
  minWidth: '12.5rem',
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
    backgroundColor: theme.colors.grayTranslucent300,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.gray200,
      transition: `background-color ${theme.transitions.hover}`,

      '&[data-state=active]': {
        backgroundColor: theme.colors.grayTranslucent400,
      },
    },
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.purple500}`,
  },
})
