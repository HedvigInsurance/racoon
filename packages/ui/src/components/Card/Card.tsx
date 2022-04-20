import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'

const CardElement = styled.div<Omit<CardProps, 'children' | 'cover'>>(
  ({ theme, bordered, size, isSelected, isFocused }) => ({
    boxSizing: 'border-box',
    borderRadius: '1rem',
    fontFamily: theme.fonts.body,
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: getColor('light'),
    border: `1px solid transparent`,
    borderWidth: isSelected ? '2px' : '1px',
    borderColor: bordered || isSelected ? colorsV3.gray500 : 'transparent',

    ...(isFocused && {
      borderColor: colorsV3.gray700,
    }),

    boxShadow: 'rgb(0 0 0 / 10%) 0px 1px 2px',
    minWidth: '16rem',
    width: size ? CardSizes[size] : 'auto',
  }),
)

const CardSizes = {
  sm: '16rem',
  md: '24rem',
  lg: '28rem',
}

export type CardProps = {
  children: React.ReactNode
  bordered?: boolean

  // Set a fixed size of the card
  size?: keyof typeof CardSizes
  isSelected?: boolean
  isFocused?: boolean
}

export const Card = ({ children, ...props }: CardProps) => {
  return <CardElement {...props}>{children}</CardElement>
}

export const CardContent = styled.div({
  padding: '1em 0.5em',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  [mq.md]: {
    padding: '1rem',

    fontSize: '1.125rem',
    lineHeight: '1.625rem',
  },
})

type CardMediaProps = {
  image: string
  height?: number
  alt: string
}

const Img = styled.img({
  width: '100%',
  objectFit: 'cover',

  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
})

export const CardMedia = ({ image, height, alt }: CardMediaProps) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <Img src={image} height={height} alt={alt} />
}
