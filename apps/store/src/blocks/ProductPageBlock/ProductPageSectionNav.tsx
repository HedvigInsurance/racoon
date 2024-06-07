'use client'

import styled from '@emotion/styled'
import { motion, useScroll } from 'framer-motion'
import type { ReactNode} from 'react';
import { useEffect, useState } from 'react'
import { mq, theme } from 'ui'
import { useActiveSectionChangeListener } from '@/blocks/ProductPageBlock/useActiveSectionChangeListener'
import { MAX_WIDTH } from '@/components/GridLayout/GridLayout.constants'
import { zIndexes } from '@/utils/zIndex'

export type PageSection = 'overview' | 'coverage'

type Props = {
  overviewLabel: ReactNode
  coverageLabel: ReactNode
}

export const NAVIGATION_LIST_HEIGHT = '2.5rem'
const SCROLL_PERCENTAGE_THRESHOLD = 10 // 10%

export function ProductPageSectionNav(props: Props) {
  const [activeSection, setActiveSection] = useState<PageSection>('overview')

  useActiveSectionChangeListener(['overview', 'coverage'], (sectionId) =>
    setActiveSection(sectionId as PageSection),
  )
  return (
    <StickyHeader>
      <nav aria-label="page content">
        <ContentNavigationList>
          <li>
            <ContentNavigationTrigger
              href="#overview"
              data-state={activeSection === 'overview' ? 'active' : 'inactive'}
              aria-current={activeSection === 'overview' ? 'true' : undefined}
            >
              {props.overviewLabel}
            </ContentNavigationTrigger>
          </li>
          <li>
            <ContentNavigationTrigger
              href="#coverage"
              data-state={activeSection === 'coverage' ? 'active' : 'inactive'}
              aria-current={activeSection === 'coverage' ? 'true' : undefined}
            >
              {props.coverageLabel}
            </ContentNavigationTrigger>
          </li>
        </ContentNavigationList>
      </nav>
    </StickyHeader>
  )
}

const StickyHeader = ({ children }: { children: ReactNode }) => {
  const { scrollY } = useScroll()
  const [matchesScrollThreshold, setMatchesScrollThreshold] = useState(false)

  useEffect(() => {
    scrollY.on('change', (currentScrollY) => {
      const scrollPercentage = Math.round(
        (currentScrollY / document.documentElement.scrollHeight) * 100,
      )
      setMatchesScrollThreshold(scrollPercentage > SCROLL_PERCENTAGE_THRESHOLD)
    })
  }, [scrollY])

  return (
    <StyledStickyHeader
      variants={{
        hidden: { opacity: 0, transitionEnd: { display: 'none' } },
        visible: { opacity: 1, display: 'revert' },
      }}
      initial="hidden"
      animate={matchesScrollThreshold ? 'visible' : 'hidden'}
    >
      {children}
    </StyledStickyHeader>
  )
}

const StyledStickyHeader = styled(motion.header)({
  position: 'sticky',
  top: theme.space.sm,
  zIndex: zIndexes.tabs,
  paddingInline: theme.space.md,
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',

  [mq.md]: {
    paddingInline: theme.space.lg,
  },
  [mq.lg]: {
    top: theme.space.md,
  },
})

const ContentNavigationList = styled.ol({
  display: 'flex',
  gap: theme.space.xs,
  height: NAVIGATION_LIST_HEIGHT,
})

const ContentNavigationTrigger = styled.a({
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
  boxShadow: theme.shadow.default,
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
    boxShadow: theme.shadow.focus,
  },
})
