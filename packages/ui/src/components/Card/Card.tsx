import { Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { getColor, mq } from '../../theme'

const CardSizes = {
  sm: '16rem',
  md: '24rem',
  lg: '28rem',
}

// Use this style to visually display something as a card, even though it's a <button> or <input type="radio">
export const cardStyle = ({
  theme,
  bordered,
  size,
}: { theme: Theme } & Omit<CardProps, 'children'>) => ({
  boxSizing: 'border-box',
  borderRadius: '1rem',
  fontFamily: theme.fonts.body,
  display: 'flex',
  flexDirection: 'column',

  backgroundColor: getColor('light'),
  border: `1px solid transparent`,
  borderColor: bordered ? getColor('gray500') : 'transparent',

  boxShadow: theme.shadow.default,
  minWidth: CardSizes.sm,
  width: size ? CardSizes[size] : 'auto',
})

// @ts-expect-error - Doesn't seem to work with passing a function that returns styling object
const CardElement = styled.div<Omit<CardProps, 'children' | 'cover'>>((props) => ({
  ...cardStyle(props),
}))

export type CardProps = {
  children?: React.ReactNode
  bordered?: boolean

  // Set a fixed size of the card
  size?: keyof typeof CardSizes
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
  return <Img src={image} height={height} alt={alt} />
}
