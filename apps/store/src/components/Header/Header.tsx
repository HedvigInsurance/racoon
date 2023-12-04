import styled from '@emotion/styled'
import { motion, Transition } from 'framer-motion'
import { mq, theme } from 'ui'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { useScrollState } from '@/utils/useScrollState'
import { zIndexes } from '@/utils/zIndex'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE, MENU_BAR_HEIGHT_PX } from './HeaderStyles'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'

export const HEADER_HEIGHT_MOBILE = `calc(${MENU_BAR_HEIGHT_MOBILE} + ${theme.space.xs})`
export const HEADER_HEIGHT_DESKTOP = `calc(${MENU_BAR_HEIGHT_DESKTOP} + ${theme.space.xs})`

const ANIMATION_VARIANTS = {
  SLIDE_IN: {
    y: 0,
    position: 'fixed',
    backgroundColor: 'var(--body-bg-color)',
    boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',
  },
  SLIDE_OUT: {
    position: 'fixed',
    y: '-150%',
  },
  HIDE: {
    y: '-150%',
    transition: { duration: 0 },
  },
} as const

// Source: https://easings.co · easeInOutCubic
const TRANSITION: Transition = { ease: [0.65, 0.05, 0.36, 1] }

type AnimationVariant = keyof typeof ANIMATION_VARIANTS | undefined

type HeaderProps = {
  children: React.ReactNode
  opaque?: boolean
  overlay?: boolean
  static?: boolean
}

export const Header = (props: HeaderProps) => {
  const { children, opaque = false, overlay = false, static: staticPosition = false } = props
  const scrollState = useScrollState({ threshold: MENU_BAR_HEIGHT_PX * 2 })

  const initialStyles = {
    backgroundColor: opaque ? 'var(--body-bg-color)' : 'var(--header-bg-transparent-color)',
  }

  let animate: AnimationVariant = scrollState === 'SCROLL_UP' ? 'SLIDE_IN' : undefined
  animate = scrollState === 'BELOW' ? 'HIDE' : animate
  animate = scrollState === 'SCROLL_DOWN' ? 'SLIDE_OUT' : animate
  animate = staticPosition ? undefined : animate

  return (
    <GhostWrapper style={initialStyles} overlay={overlay}>
      <Wrapper
        initial={initialStyles}
        variants={ANIMATION_VARIANTS}
        animate={animate}
        transition={TRANSITION}
      >
        <LogoWrapper>
          <LogoHomeLink />
        </LogoWrapper>
        <ContentWrapper>
          {children}
          <ShoppingCartMenuItem />
        </ContentWrapper>
      </Wrapper>
    </GhostWrapper>
  )
}

const GhostWrapper = styled.div<{ overlay: boolean }>(({ overlay }) => ({
  '--height': HEADER_HEIGHT_MOBILE,

  position: 'relative',
  height: 'var(--height)',
  // Using negative margin to pull page's content bellow the menu causing the desired
  // 'menu overlay' behaviour. Before that was being implemented by removing the header
  // from doc's flow with absolute positioning. However that solution doesn't play well
  // if we have banners/announcements on the screen.
  marginBottom: overlay ? 'calc(-1 * var(--height))' : 'initial',
  zIndex: zIndexes.header,

  [mq.lg]: { '--height': HEADER_HEIGHT_DESKTOP },
}))

export const Wrapper = styled(motion.header)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  top: 0,
  zIndex: zIndexes.header,

  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: theme.space.md,
  [mq.lg]: {
    height: MENU_BAR_HEIGHT_DESKTOP,
    paddingInline: theme.space.xl,
  },
})

export const LogoWrapper = styled.div({
  // Fix to make sure line-height doesn't affect wrapper height
  fontSize: 0,
  flex: 1,
})

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: 1,
  gap: theme.space.xs,

  [mq.lg]: {
    justifyContent: 'space-between',
  },
})
