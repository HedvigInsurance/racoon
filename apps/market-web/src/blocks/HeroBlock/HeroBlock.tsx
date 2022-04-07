import { css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import { HedvigSymbol } from '@hedviginsurance/brand'
import { FontSizes, Heading } from 'components/Heading/Heading'
import React from 'react'
import { ButtonColors } from 'ui/src/components/Button/button'
import { LinkButton, ButtonVariant, mq } from 'ui'
import { TextPosition } from '@/helpers/textPosition'
import { getStoryblokImage, getStoryblokLinkUrl } from '@/services/storyblok/storyblok'
import {
  LinkComponent,
  MarkdownHtmlComponent,
  MinimalColorComponent,
  StoryblokBaseBlock,
  Image,
} from '@/services/storyblok/types'
import { SectionWrapper, ContentWrapper, getMinimalColorStyles } from '../blockHelpers'

interface Animatable {
  animate?: boolean
}

type TextProps = {
  colorComponent?: MinimalColorComponent
  textPosition?: TextPosition
} & Animatable

interface WrapperProps {
  colorComponent?: MinimalColorComponent
  height?: '80vh' | '90vh' | '100vh'
}

const Wrapper = styled(SectionWrapper)<WrapperProps>(({ height }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  minHeight: height ?? '100vh',
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
}))

const WrapperWithExtraStyling = styled(Wrapper)<{ extraStyling?: string }>`
  ${({ extraStyling }) => extraStyling};
`

const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
`

const HeroContent = styled(ContentWrapper)({
  zIndex: 2,
})

const HeadlineWrapper = styled.div<Animatable>(({ animate }) => ({
  position: 'relative',
  animation: animate ? `${fadeSlideIn} 800ms forwards` : 'none',
  opacity: animate ? 0 : 1,
  animationDelay: '1000ms',
  marginBottom: '1rem',
  br: {
    display: 'none',
  },
  [mq.md]: {
    br: {
      display: 'block',
    },
  },
  [mq.lg]: {
    marginBottom: '1.25rem',
  },
}))

const HeroHeadline = styled(Heading)({
  display: 'inline',
})

const Text = styled.div<TextProps>((props) => ({
  animation: props.animate ? `${fadeSlideIn} 800ms forwards` : 'none',
  opacity: props.animate ? 0 : 1,
  animationDelay: '1200ms',
  maxWidth: ' 40rem',
  marginLeft: props.textPosition === 'left' ? '0' : 'auto',
  marginRight: props.textPosition === 'right' ? '0' : 'auto',
  color: getMinimalColorStyles(props.colorComponent?.color ?? 'standard').color,
  fontSize: '1rem',
  lineHeight: 1.5,
  textAlign: props.textPosition ?? 'center',

  br: {
    display: 'none',
  },
  [mq.md]: {
    br: {
      display: 'block',
    },
  },
}))

const Wordmark = styled.div({
  display: 'inline-flex',
  position: 'absolute',
  marginTop: '0.375rem',
  marginLeft: '0.25rem',

  svg: {
    width: '0.75rem',
    height: '0.75rem',
  },
  [mq.md]: {
    marginTop: '0.5rem',
    marginLeft: '0.375rem',
    svg: {
      width: '1rem',
      height: '1rem',
    },
  },
})

const ButtonWrapper = styled.div<Animatable>(({ animate }) => ({
  display: 'flex',
  paddingTop: '0.5rem',
  animation: animate ? `${fadeSlideIn} 800ms forwards` : 'none',
  opacity: animate ? 0 : 1,
  animationDelay: '1200ms',
  [mq.md]: {
    paddingTop: '1rem',
  },
}))

export interface HeroBlockProps extends StoryblokBaseBlock {
  headline: string
  headline_font_size: FontSizes
  headline_font_size_mobile?: FontSizes
  text?: MarkdownHtmlComponent
  text_color?: MinimalColorComponent
  text_position?: TextPosition
  image: Image
  image_mobile: Image
  hide_bg_tint: boolean
  animate?: boolean
  show_hedvig_wordmark?: boolean
  height?: '80vh' | '90vh' | '100vh'
  show_cta?: boolean
  cta_label?: string
  cta_link?: LinkComponent
  cta_color?: MinimalColorComponent
  cta_style?: ButtonVariant
}

export const HeroBlock = ({
  color,
  extra_styling,
  animate,
  headline,
  text,
  text_color,
  headline_font_size,
  headline_font_size_mobile,
  image,
  image_mobile,
  hide_bg_tint,
  index,
  show_hedvig_wordmark,
  height,
  text_position = 'left',
  show_cta,
  cta_label,
  cta_link,
  cta_color,
  cta_style,
}: HeroBlockProps) => {
  return (
    <WrapperWithExtraStyling
      colorComponent={color}
      extraStyling={extra_styling}
      backgroundImage={getStoryblokImage(image)}
      backgroundTint={!hide_bg_tint}
      backgroundImageMobile={getStoryblokImage(image_mobile)}
      height={height}
    >
      <HeroContent index={index} fullWidth={false}>
        <HeadlineWrapper animate={animate}>
          <HeroHeadline
            as="h1"
            size={headline_font_size}
            mobileSize={headline_font_size_mobile}
            textPosition={text_position}
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          {show_hedvig_wordmark && (
            <Wordmark>
              <HedvigSymbol />
            </Wordmark>
          )}
        </HeadlineWrapper>
        {text && (
          <Text
            dangerouslySetInnerHTML={{ __html: text?.html }}
            animate={animate}
            colorComponent={text_color}
            textPosition={text_position}
          />
        )}
        {show_cta && cta_link && (
          <ButtonWrapper animate={animate}>
            <LinkButton
              color={cta_color?.color as ButtonColors}
              variant={cta_style}
              href={getStoryblokLinkUrl(cta_link)}
            >
              {cta_label}
            </LinkButton>
          </ButtonWrapper>
        )}
      </HeroContent>
    </WrapperWithExtraStyling>
  )
}
