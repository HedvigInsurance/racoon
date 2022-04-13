import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { getColor } from '../../lib/theme'

const CardElement = styled.div<Omit<CardProps, 'children'>>(
  ({ theme, bordered, size, isSelected, isFocused }) => ({
    boxSizing: 'border-box',
    padding: `calc(1rem - ${isSelected ? '1px' : '0px'})`,
    borderRadius: '0.75rem',
    fontFamily: theme.fonts.body,

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

const HeaderElement = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.5rem',
  paddingTop: '3rem',
  paddingBottom: '0.75rem',
  marginBottom: '0.75rem',
  borderBottom: `1px solid ${colorsV3.gray500}`,
})

const TitleElement = styled.div({})

const ExtraElement = styled.div({
  color: colorsV3.gray500,
})

const CardSizes = {
  sm: '16rem',
  md: '24rem',
  lg: '28rem',
}

export type CardProps = {
  children: React.ReactNode
  bordered?: boolean
  title?: React.ReactNode
  extra?: string
  // Set a fixed size of the card
  size?: keyof typeof CardSizes
  isSelected?: boolean
  isFocused?: boolean
}

export const Card = ({ children, title, extra, ...props }: CardProps) => {
  return (
    <CardElement {...props}>
      {(title || extra) && (
        <HeaderElement>
          {title && <TitleElement>{title}</TitleElement>}
          {extra && <ExtraElement>{extra}</ExtraElement>}
        </HeaderElement>
      )}
      {children}
    </CardElement>
  )
}

Card.defaultProps = {
  isSelected: false,
  isFocused: false,
  bordered: false,
}
