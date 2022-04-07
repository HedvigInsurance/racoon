import styled from '@emotion/styled'
import { colorsV3, HedvigLogo, HedvigSymbol } from '@hedviginsurance/brand'
import { useCurrentLocale } from 'lib/l10n/useCurrentLocale'
import React, { useCallback, useEffect, useState } from 'react'
import { StoryData } from 'storyblok-js-client'
import { ButtonColors } from 'ui/src/components/Button/button'
import { MenuItem } from 'ui/src/components/Menu/MenuItem'
import { mq, ButtonVariant, LinkButton, BurgerButton } from 'ui'
import { getStoryblokLinkUrl } from '@/services/storyblok/storyblok'
import {
  LinkComponent,
  MinimalColorComponent,
  minimalColorComponentColors,
  StoryblokBaseBlock,
} from '@/services/storyblok/types'
import { BannerBlock } from '../BannerBlock/BannerBlock'
import { MenuBlock } from '../MenuBlock/MenuBlock'

export const WRAPPER_HEIGHT = '5rem'
export const MOBILE_WRAPPER_HEIGHT = '4.5rem'
export const TOGGLE_TRANSITION_TIME = 250

const isBelowScrollThreshold = () => typeof window !== 'undefined' && window.scrollY > 20

const HeaderWrapper = styled('header')({
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const HeaderBackgroundFiller = styled('div')<{ transparent: boolean }>(({ transparent }) => ({
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
})

const InnerHeaderWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 0.75rem',

  backgroundColor: colorsV3.gray900,

  height: MOBILE_WRAPPER_HEIGHT,
  [mq.md]: {
    height: WRAPPER_HEIGHT,
    padding: '0 2rem',
  },
})

const HideOnMobile = styled('div')({
  display: 'none',
  [mq.md]: {
    display: 'flex',
  },
})

const HideOnDesktop = styled('div')({
  position: 'initial',
  zIndex: 102,
  [mq.md]: {
    display: 'none',
  },
})

const LogoLink = styled('a')<{
  inverse: boolean
}>(({ inverse }) => ({
  display: 'flex',
  color: inverse ? colorsV3.gray100 : colorsV3.gray900,
  transition: 'color 300ms',

  svg: {
    height: '100%',
  },
}))

const LeftContainer = styled('div')({
  display: 'flex',
})
const RightContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
})

const MobileButtonWrapper = styled('div')({
  display: 'inline-block',
  width: '100%',
  marginBottom: '7rem',
  [mq.md]: {
    display: 'none',
  },
})

const DesktopButtonWrapper = styled('div')({
  display: 'none',
  [mq.md]: {
    display: 'inline-block',
  },
})

const Wordmark = styled('a')({
  display: 'block',
  width: '1.75rem',
  height: '1.75rem',
  zIndex: 102,

  // same as buttons
  // padding: "0 0.75rem"
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

enum InverseColors {
  DEFAULT = 'standard-inverse',
  INVERSE = 'standard',
}

export const PageHeaderBlock = (props: { story: StoryData } & PageHeaderBlockProps) => {
  // console.log(props.story)
  const currentLocale = useCurrentLocale()

  const showBanner =
    props.story.content.show_banner && props.story.content.banner_text && !props.hide_global_banner

  const [isBelowThreshold, setIsBelowThreshold] = useState<boolean>(false)

  const inverseColor = props.is_transparent && props.inverse_colors && !isBelowThreshold

  const [buttonColor, setButtonColor] = useState<minimalColorComponentColors | undefined>(
    inverseColor ? InverseColors.DEFAULT : props.cta_color?.color,
  )

  // console.log(props)
  // console.log('inverseColor', inverseColor)

  const [isOpen, setIsOpen] = useState(false)

  const handleScroll = useCallback(() => {
    if (isBelowScrollThreshold()) {
      setIsBelowThreshold(true)
      if (props.inverse_colors && props.is_transparent) {
        setButtonColor(InverseColors.INVERSE)
      }
      return
    }

    setIsBelowThreshold(false)
    if (props.inverse_colors && props.is_transparent) {
      setButtonColor(InverseColors.DEFAULT)
    }
  }, [props.inverse_colors, props.is_transparent])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      if (!props.is_transparent) {
        return
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, props.is_transparent])

  const ctaLabel = props.override_cta_label || props.story.content.cta_label

  if (!props?.story?.content) return null

  return (
    <>
      {showBanner && (
        <BannerBlock
          color={props.story.content.banner_color}
          text={props.story.content.banner_text}
        />
      )}
      <HeaderWrapper>
        {/* <HeaderMain
          inverse={inverseColor}
          open={true}
          // open={isOpen || isClosing}
          sticky={isBelowThreshold}
        > */}

        <HeaderBackgroundFiller transparent={props.is_transparent && !isBelowThreshold} />

        <ContentWrapper>
          <InnerHeaderWrapper>
            <LeftContainer>
              <HideOnMobile>
                <LogoLink inverse={inverseColor} href={'/' + currentLocale.marketLabel}>
                  <HedvigLogo width={94} />
                </LogoLink>
              </HideOnMobile>

              <HideOnDesktop>
                <BurgerButton color="light" onClick={() => setIsOpen(!isOpen)} />
              </HideOnDesktop>
            </LeftContainer>
            <RightContainer>
              <HideOnDesktop>
                <Wordmark href={'/' + currentLocale.marketLabel}>
                  <HedvigSymbol size={28} color={colorsV3.gray100} />
                </Wordmark>
              </HideOnDesktop>

              {!props.hide_menu && (
                <MenuBlock
                  isOpen={isOpen}
                  items={props.story.content.header_menu_items}
                  theme={inverseColor ? 'light' : 'dark'}
                  cta={
                    <LinkButton
                      variant={props.cta_style}
                      color={buttonColor as ButtonColors}
                      // fullWidth={true}
                      href={getStoryblokLinkUrl(props.override_cta_link)}
                    >
                      {ctaLabel}
                    </LinkButton>
                  }
                />
              )}
            </RightContainer>
          </InnerHeaderWrapper>
        </ContentWrapper>

        {/* </HeaderMain> */}
      </HeaderWrapper>
    </>
  )
}
