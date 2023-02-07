import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { HedvigLogo, mq, theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { zIndexes } from '@/utils/zIndex'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from './HeaderStyles'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'
import { useScrollDirection } from './useScrollDirection'

type HeaderProps = {
  children: React.ReactNode
  opaque?: boolean
  overlay?: boolean
}

export const Header = ({ children, opaque = false, overlay = false }: HeaderProps) => {
  const scrollDirection = useScrollDirection({ threshold: 128 })

  const headerContent = (
    <>
      <LogoWrapper href={PageLink.home()}>
        <HedvigLogo />
      </LogoWrapper>
      <ContentWrapper>
        {children}
        <ShoppingCartMenuItem />
      </ContentWrapper>
    </>
  )

  return (
    <>
      <Wrapper opaque={opaque} overlay={overlay}>
        {headerContent}
      </Wrapper>

      <AnimatePresence>
        {scrollDirection === 'up' && (
          <FloatingWrapper
            initial={{ y: '-150%' }}
            animate={{ y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: 'just' }}
          >
            {headerContent}
          </FloatingWrapper>
        )}
      </AnimatePresence>
    </>
  )
}

const wrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: theme.space.md,

  [mq.lg]: {
    flexDirection: 'row',
    height: MENU_BAR_HEIGHT_DESKTOP,
    padding: `0 ${theme.space.xl}`,
  },
})

type WrapperProps = Pick<HeaderProps, 'opaque' | 'overlay'>

export const Wrapper = styled.header<WrapperProps>(wrapperStyles, ({ opaque, overlay }) => ({
  backgroundColor: opaque ? theme.colors.backgroundStandard : 'transparent',

  ...(overlay && {
    position: 'absolute',
    top: 0,
    zIndex: zIndexes.header,
  }),
}))

const FloatingWrapper = styled(motion.header)(wrapperStyles, {
  position: 'fixed',
  top: 0,
  zIndex: zIndexes.header,
  backgroundColor: theme.colors.backgroundStandard,
  boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',
})

const LogoWrapper = styled(Link)({
  flex: 1,
  WebkitTapHighlightColor: 'transparent',
  ':active': { opacity: 0.75 },
})

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: 1,

  [mq.lg]: {
    justifyContent: 'space-between',
  },
})
