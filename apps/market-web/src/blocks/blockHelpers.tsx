import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { match } from 'matchly'
import React from 'react'
import { mq } from 'ui'
import { MinimalColorComponent, minimalColorComponentColors } from '@/services/storyblok/types'

export const CONTENT_GUTTER = '2rem'
export const CONTENT_GUTTER_MOBILE = '1rem'

export const SITE_MAX_WIDTH = {
  maxWidth: '100%',
}

export const CONTENT_MAX_WIDTH = {
  maxWidth: 1000,
}

export const CONTENT_MAX_WIDTH_XL = {
  maxWidth: 1200,
  [mq.xxl]: {
    maxWidth: 1500,
  },
}

export type SectionSize = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SectionSizeProps = {
  size: SectionSize
}

type ColorSet = {
  color: string
  background: string
  secondaryColor?: string
}

const sectionSizeStyles = {
  none: { padding: 0 },
  xxs: {
    padding: '0.25rem 0',
    [mq.lg]: {
      padding: '0.5rem 0',
    },
  },
  xs: {
    padding: '0.5rem 0',
    [mq.lg]: {
      padding: '1rem 0',
    },
  },
  sm: {
    padding: '2rem 0',
    [mq.lg]: {
      padding: '3.5rem 0',
    },
  },
  md: {
    padding: '2.5rem 0',
    [mq.lg]: {
      padding: '5rem 0',
    },
  },
  lg: {
    padding: '3.5rem 0',
    [mq.lg]: {
      padding: '7.5rem 0',
    },
  },
  xl: {
    padding: '6rem 0',
    [mq.lg]: {
      padding: '10rem 0',
    },
  },
}

export type ColorSetGetter<TColors> = (
  colors: TColors,
  standardColor?: string,
  standardInverseColor?: string,
) => ColorSet

export const getMinimalColorStyles: ColorSetGetter<minimalColorComponentColors> = (
  color,
  standardColor = colorsV3.gray100,
  standardInverseColor = colorsV3.gray900,
) =>
  match([
    [
      'standard',
      {
        background: standardColor,
        color: standardInverseColor,
        secondaryColor: colorsV3.gray700,
      },
    ],
    [
      'standard-inverse',
      {
        background: standardInverseColor,
        color: standardColor,
        secondaryColor: colorsV3.gray500,
      },
    ],
    ['gray700', { background: standardColor, color: colorsV3.gray700 }],
    ['gray500-inverse', { background: colorsV3.gray900, color: colorsV3.gray500 }],
    [
      'purple300',
      {
        background: colorsV3.purple300,
        color: colorsV3.gray900,
      },
    ],
    [
      'purple500',
      {
        background: colorsV3.purple500,
        color: colorsV3.gray900,
      },
    ],
    [match.any(), { background: standardColor, color: standardInverseColor }],
  ])(color)!

export const getSectionSizeStyle = (size: SectionSize) => sectionSizeStyles[size]

export const backgroundImageStyles = (
  backgroundImage = '',
  backgroundImageMobile = '',
  tint = false,
) => {
  if (backgroundImage === '') {
    return
  }

  const bgTint = tint ? 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),' : ''

  return {
    backgroundImage: `${bgTint} url(${backgroundImageMobile})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',

    [mq.md]: backgroundImageMobile
      ? {
          backgroundImage: `${bgTint} url(${backgroundImage})`,
        }
      : {},
  }
}
type SectionProps = {
  as?: React.ElementType
  children?: React.ReactNode
  colorComponent?: MinimalColorComponent
  size?: SectionSize
  backgroundImage?: string
  backgroundImageMobile?: string
  backgroundTint?: boolean
  extraStyling?: string
}

const SectionWrapperComponentUnstyled = styled.section<SectionProps>(
  ({ colorComponent, size = 'lg', theme }) => ({
    position: 'relative',
    transition: 'background 300ms',
    ...getSectionSizeStyle(size),
    color: getMinimalColorStyles(colorComponent?.color ?? 'standard').color,
  }),
)

export const SectionWrapperComponent = styled(SectionWrapperComponentUnstyled)<SectionProps>`
  ${({ extraStyling = '' }) => String(extraStyling)}
`
const SectionBackground = styled.div<{
  backgroundImage?: string
  backgroundImageMobile?: string
  tint?: boolean
  colorComponent?: MinimalColorComponent
}>(({ backgroundImage, backgroundImageMobile, tint, colorComponent }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  minHeight: '100%',
  minWidth: '100%',
  backgroundColor: getMinimalColorStyles(colorComponent?.color ?? 'standard').background,
  ...backgroundImageStyles(backgroundImage || '', backgroundImageMobile || '', tint),
  zIndex: -1,
}))

export const SectionWrapper = ({
  children,
  backgroundImage,
  backgroundImageMobile,
  backgroundTint,
  ...props
}: SectionProps) => {
  return (
    <SectionWrapperComponent {...props}>
      <SectionBackground
        backgroundImage={backgroundImage}
        backgroundImageMobile={backgroundImageMobile}
        tint={backgroundTint}
        colorComponent={props.colorComponent}
      />
      {children}
    </SectionWrapperComponent>
  )
}

export const MarginSectionWrapper = styled.section<SectionProps>(
  ({ colorComponent, size = 'lg', backgroundImage = 'none' }) => ({
    ...getSectionSizeStyle(size),
    ...getMinimalColorStyles(colorComponent?.color ?? 'standard'),
    ...backgroundImageStyles(backgroundImage),
  }),
)

const getContentMaxWidth = (contentWidth: boolean, fullWidth: boolean) => {
  if (fullWidth) {
    return SITE_MAX_WIDTH
  }
  if (contentWidth) {
    return CONTENT_MAX_WIDTH
  }
  return CONTENT_MAX_WIDTH_XL
}

export const ContentWrapperStyled = styled.div<{
  visible: boolean
  contentWidth: boolean
  fullWidth: boolean
}>(({ visible, contentWidth, fullWidth }) => ({
  width: '100%',
  margin: '0 auto',
  padding: '0 ' + CONTENT_GUTTER_MOBILE,

  [mq.xs]: {
    padding: '0 ' + CONTENT_GUTTER,
  },

  ...getContentMaxWidth(contentWidth, fullWidth),

  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(5%)',
  transition: 'opacity 800ms, transform 500ms',
}))

export type ContentWrapperProps = {
  index?: number
  children: React.ReactNode
  contentWidth?: boolean
  fullWidth?: boolean
}

export const ContentWrapper = ({
  index = 0,
  contentWidth = false,
  children,
  fullWidth = false,
  ...props
}: ContentWrapperProps) => (
  <ContentWrapperStyled visible={true} contentWidth={contentWidth} fullWidth={fullWidth} {...props}>
    {children}
  </ContentWrapperStyled>
)
