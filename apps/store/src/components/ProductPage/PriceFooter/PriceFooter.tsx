import styled from '@emotion/styled'
import { Button as UIButton, Separate, Space } from 'ui'

export type FooterProps = {
  children: React.ReactNode
}

export const Footer = ({ children }: FooterProps) => {
  return <Wrapper y={1}>{children}</Wrapper>
}

const Wrapper = styled(Space)({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
})

export type ButtonProps = {
  type?: 'button' | 'submit'
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
}

export const Button = ({ onClick, disabled, type = 'submit', children }: ButtonProps) => {
  return (
    <FlexButton type={type} onClick={onClick} disabled={disabled}>
      <Separate Separator={<Separator />}>{children}</Separate>
    </FlexButton>
  )
}

const FlexButton = styled(UIButton)(() => ({
  display: 'flex',
  lineHeight: 1.125,
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
}))

const Separator = styled.div(({ theme }) => ({
  width: 1,
  backgroundColor: theme.colors.gray600,
  margin: `0 ${theme.space[3]}`,
  alignSelf: 'stretch',
}))
