import styled from '@emotion/styled'
import { colorsV3, HedvigLogo, HedvigSymbol } from '@hedviginsurance/brand'
import { useCurrentLocale } from 'lib/l10n/useCurrentLocale'
import React, { useCallback, useEffect, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { StoryData } from 'storyblok-js-client'
import { MenuTheme } from 'ui/src/components/Menu/Menu'
import { useBreakpoint } from 'ui/src/lib/media-query'
import { getColor } from 'ui/src/lib/theme'
import { mq, ButtonVariant, LinkButton, BurgerButton } from 'ui'
import { Menu, MOBILE_WRAPPER_HEIGHT, WRAPPER_HEIGHT } from '@/components/Menu/Menu'
import { getStoryblokLinkUrl } from '@/services/storyblok/storyblok'
import {
  LinkComponent,
  MinimalColorComponent,
  StoryblokBaseBlock,
} from '@/services/storyblok/types'

// When user scrolls past this limit the transparent menu will get a colored background
const SCROLL_THRESHOLD = 20

const isBelowScrollThreshold = () =>
  typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD

const HeaderWrapper = styled.header({
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const HeaderBackgroundFiller = styled.div<{ transparent: boolean }>(({ transparent }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  height: MOBILE_WRAPPER_HEIGHT,
  opacity: transparent ? 0 : 1,
  backgroundColor: colorsV3.gray900,
  transitionDuration: '300ms',
  transitionProperty: 'opacity, background-color',

  [mq.md]: {
    height: WRAPPER_HEIGHT,
    backgroundColor: colorsV3.gray100,
  },
}))

const ContentWrapper = styled.div({
  position: 'absolute',
  width: '100%',
  height: MOBILE_WRAPPER_HEIGHT,

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  // The burger menu button has a padding of 0.75rem so add 1rem padding for logo
  padding: '0 1rem 0 0.25rem',

  [mq.md]: {
    height: WRAPPER_HEIGHT,
    padding: '0 2rem',
  },
})

const HideOnMobile = styled.div({
  display: 'none',
  [mq.md]: {
    display: 'flex',
  },
})

const HideOnDesktop = styled.div({
  position: 'initial',
  zIndex: 102,
  [mq.md]: {
    display: 'none',
  },
})

const LogoLink = styled.a<{
  color: MenuTheme
}>(({ color }) => ({
  display: 'flex',
  color: getColor(color),
  transition: 'color 300ms',
  ':hover': {
    color: getColor(color),
  },
  svg: {
    height: '100%',
  },
}))

const LeftContainer = styled.div({
  display: 'flex',
})

const RightContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const Wordmark = styled.a({
  display: 'block',
  width: '1.75rem',
  height: '1.75rem',
  zIndex: 102,
})

const MobilePosition = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',

  [mq.md]: {
    position: 'initial',
    width: 'auto',
  },
})

export interface PageHeaderBlockProps extends StoryblokBaseBlock {
  is_transparent: boolean
  inverse_colors: boolean
  override_cta_link?: LinkComponent
  override_cta_label?: string | null
  cta_color?: MinimalColorComponent
  cta_style?: ButtonVariant
  hide_menu?: boolean
  hide_global_banner?: boolean
  override_mobile_header_cta_label?: string | null
  override_mobile_header_cta_link?: LinkComponent | null
  mobile_header_cta_color?: MinimalColorComponent
  mobile_header_cta_style?: ButtonVariant
}

export const PageHeaderBlock = (props: { story: StoryData } & PageHeaderBlockProps) => {
  const currentLocale = useCurrentLocale()

  const showBanner =
    props.story.content.show_banner && props.story.content.banner_text && !props.hide_global_banner

  const [isBelowThreshold, setIsBelowThreshold] = useState<boolean>(false)
  const isDesktop = useBreakpoint('md')

  const inverseColor = props.is_transparent && props.inverse_colors && !isBelowThreshold
  const theme = (isDesktop ? (inverseColor ? 'light' : 'dark') : 'light') as MenuTheme
  const ctaLabel = props.override_cta_label || props.story.content.cta_label

  const [isOpen, setIsOpen] = useState(isDesktop)

  const onScroll = useCallback(() => {
    setIsBelowThreshold(isBelowScrollThreshold())
  }, [])

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  useEffect(() => {
    // Only scroll menu on mobile, not entire page
    if (isOpen && !isDesktop) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'initial'
    }

    return () => {
      document.body.style.overflow = 'initial'
    }
  }, [isOpen, isDesktop])

  if (!props?.story?.content) return null

  return (
    <>
      {/* {showBanner && (
        <BannerBlock
          color={props.story.content.banner_color}
          text={props.story.content.banner_text}
        />
      )} */}
      <HeaderWrapper>
        <HeaderBackgroundFiller transparent={props.is_transparent && !isBelowThreshold} />

        <ContentWrapper>
          <LeftContainer>
            <HideOnMobile>
              <LogoLink color={theme} href={'/' + currentLocale.marketLabel}>
                <HedvigLogo width={94} />
              </LogoLink>
            </HideOnMobile>

            <HideOnDesktop>
              <BurgerButton
                color="light"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="nav-menu"
              />
            </HideOnDesktop>
          </LeftContainer>
          <RightContainer>
            <HideOnDesktop>
              <Wordmark href={'/' + currentLocale.marketLabel}>
                <HedvigSymbol size={28} color={colorsV3.gray100} />
              </Wordmark>
            </HideOnDesktop>

            {!props.hide_menu && (
              <MobilePosition>
                <AnimateHeight height={isOpen ? 'auto' : 0}>
                  <Menu
                    id="nav-menu"
                    items={props.story.content.header_menu_items}
                    theme={theme}
                    cta={
                      <LinkButton
                        variant={props.cta_style || 'outlined'}
                        color={theme}
                        fullWidth={!isDesktop}
                        href={
                          props.override_cta_link && getStoryblokLinkUrl(props.override_cta_link)
                        }
                      >
                        {ctaLabel}
                      </LinkButton>
                    }
                  />
                </AnimateHeight>
              </MobilePosition>
            )}
          </RightContainer>
        </ContentWrapper>
      </HeaderWrapper>
    </>
  )
}
